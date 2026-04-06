import os
import base64
import json
import sys
import socket
import threading
import webbrowser
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dashscope import MultiModalConversation
from typing import Optional

app = FastAPI(title="智汇衣橱 AI 分析服务")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("DASHSCOPE_API_KEY", "sk-02ac3fa059f745e9a0de2376de5ca927")
DEFAULT_PORT = int(os.getenv("PORT", "8000"))

if not API_KEY:
    raise ValueError("DASHSCOPE_API_KEY environment variable not set")


def get_project_root() -> Path:
    if getattr(sys, "frozen", False):
        return Path(getattr(sys, "_MEIPASS", Path.cwd()))
    return Path(__file__).resolve().parent.parent


PROJECT_ROOT = get_project_root()
DIST_DIR = PROJECT_ROOT / "dist"
INDEX_FILE = DIST_DIR / "index.html"


class AnalyzeResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None


def encode_image_to_base64(file_content: bytes) -> str:
    return base64.b64encode(file_content).decode("utf-8")


def parse_ai_response(content: str) -> dict:
    try:
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        return json.loads(content)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Failed to parse AI response as JSON: {e}, content: {content}"
        )


def frontend_ready() -> bool:
    return INDEX_FILE.exists()


def safe_static_path(full_path: str) -> Optional[Path]:
    if not full_path:
        return None
    candidate = (DIST_DIR / full_path).resolve()
    dist_root = DIST_DIR.resolve()
    try:
        candidate.relative_to(dist_root)
    except ValueError:
        return None
    return candidate if candidate.is_file() else None


def find_available_port(start_port: int, max_tries: int = 20) -> int:
    for port in range(start_port, start_port + max_tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            if sock.connect_ex(("127.0.0.1", port)) != 0:
                return port
    raise RuntimeError("No available local port found")


@app.get("/", include_in_schema=False)
async def root():
    if frontend_ready():
        return FileResponse(INDEX_FILE)
    return {"message": "智汇衣橱 AI 分析服务", "status": "running"}


@app.get("/api/health")
async def health():
    return {"message": "智汇衣橱 AI 分析服务", "status": "running"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_clothing(image: UploadFile = File(...)):
    try:
        image_content = await image.read()
        image_base64 = encode_image_to_base64(image_content)

        messages = [
            {
                "role": "user",
                "content": [
                    {"image": f"data:image/jpeg;base64,{image_base64}"},
                    {
                        "text": """请先判断这张图片是否是服装、鞋子或配饰（包含衣物、服饰、鞋袜、帽子、包袋、手表、围巾等）。

如果图片是服装/鞋子/配饰，请以 JSON 格式提取信息：
{
  "is_valid": true,
  "meta": {
    "category": "分类（上装/下装/鞋履/配饰）",
    "sub_category": "子类（如T恤、牛仔裤、运动鞋、手表等）",
    "color": "主要颜色",
    "style": "风格（休闲/正式/运动/复古）",
    "material": "材质（可选）",
    "fit": "版型（可选）"
  },
  "report": "100字左右的专业点评和搭配建议"
}

如果图片不是服装/鞋子/配饰，请返回：
{"is_valid": false, "error": "未识别到衣物，请上传服装、鞋子或配饰的图片"}

请直接返回纯 JSON 格式，不要包含 Markdown 标记。"""
                    },
                ],
            }
        ]

        response = MultiModalConversation.call(
            model="qwen-vl-max", messages=messages, api_key=API_KEY
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"DashScope API error: {response.code} - {response.message}",
            )

        content = response.output.choices[0].message.content
        if isinstance(content, list):
            text_content = content[0].get("text", "")
        else:
            text_content = str(content)

        parsed_data = parse_ai_response(text_content)

        if not parsed_data.get("is_valid", True):
            return AnalyzeResponse(
                success=False,
                error=parsed_data.get(
                    "error", "未识别到衣物，请上传服装、鞋子或配饰的图片"
                ),
            )

        if not parsed_data.get("meta") or not parsed_data.get("meta", {}).get(
            "category"
        ):
            return AnalyzeResponse(
                success=False,
                error="未识别到衣物，请上传服装、鞋子或配饰的图片",
            )

        return AnalyzeResponse(success=True, data=parsed_data)

    except HTTPException:
        raise
    except Exception as e:
        return AnalyzeResponse(success=False, error=str(e))


@app.post("/api/style-consult")
async def style_consult(request: dict):
    try:
        height = request.get("height", 170)
        weight = request.get("weight", 65)
        body_type = request.get("bodyType", "normal")
        scene = request.get("scene", "casual")
        preferences = request.get("preferences", "")

        body_analysis = f"身高{height}cm，体重{weight}kg，"
        if body_type == "slim":
            body_analysis += "偏瘦体型，建议选择修身的衣服来展现身材比例。"
        elif body_type == "muscular":
            body_analysis += "肌肉型身材，适合穿着有结构感的上装。"
        elif body_type == "curvy":
            body_analysis += "丰满身材，建议选择宽松或有垂感的款式。"
        elif body_type == "pear":
            body_analysis += "梨形身材，建议上紧下松，突出上半身。"
        elif body_type == "apple":
            body_analysis += "苹果形身材，建议选择高腰款式。"
        else:
            body_analysis += "标准身材，大多数款式都适合。"

        style_direction = "简约干练风格" if scene == "commute" else "舒适休闲风格"
        if preferences:
            style_direction = preferences

        return {
            "success": True,
            "data": {
                "body_analysis": body_analysis,
                "style_direction": style_direction,
                "top_recommendations": [
                    {
                        "type": "T恤",
                        "length": "常规",
                        "fit": "修身" if body_type == "slim" else "常规",
                    },
                    {"type": "衬衫", "length": "常规", "fit": "宽松"},
                ],
                "bottom_recommendations": [
                    {"type": "牛仔裤", "length": "九分"},
                    {"type": "休闲裤", "length": "常规"},
                ],
                "shoe_recommendations": [
                    {"type": "运动鞋", "heel_height": "平底"},
                    {"type": "休闲鞋", "heel_height": "低跟"},
                ],
                "tips": "注意上下搭配的比例协调，颜色尽量保持简洁。",
            },
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str):
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API route not found")

    if not frontend_ready():
        raise HTTPException(status_code=404, detail="Frontend build not found")

    static_file = safe_static_path(full_path)
    if static_file:
        return FileResponse(static_file)

    return FileResponse(INDEX_FILE)


if __name__ == "__main__":
    import uvicorn

    port = find_available_port(DEFAULT_PORT)
    auto_open = os.getenv("SW_AUTO_OPEN", "1") == "1"
    if auto_open:
        threading.Timer(1.2, lambda: webbrowser.open(f"http://127.0.0.1:{port}")).start()

    uvicorn.run(app, host="127.0.0.1", port=port)
