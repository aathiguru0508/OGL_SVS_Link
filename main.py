from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import List
import io

app = FastAPI(title="OGL Link Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REQUIRED_COLS = [
    "Product Name",
    "Module Name",
    "App ID",
    "Guide Name",
    "API Name",
]

STEP_TEMPLATE = "https://guidedlearning.oracle.com/player/latest/api/scenario/export/v2/{app}/{api}/lang/--/?draft=dev&_=1753247139&windowMode=unpin"
VIDEO_TEMPLATE = "https://guidedlearning.oracle.com/player/latest/api/scenario/simulation/see_it/{app}/{api}/lang/--/?draft=true&user_id=Anonhel4yjosrgi&_=1750827437"
SIM_TEMPLATE = "https://guidedlearning.oracle.com/player/latest/api/scenario/simulation/try_it/{app}/{api}/lang/--/?draft=true&user_id=Anonhel4yjosrgi&_=1750827461"


@app.post("/upload")
async def upload_excel(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Only Excel files (.xlsx, .xls) are supported.")

    contents = await file.read()
    try:
        df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read Excel file: {e}")

    df.columns = [str(c).strip() for c in df.columns]
    missing = [c for c in REQUIRED_COLS if c not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail={
            "error": "Missing required columns",
            "missing_columns": missing
        })

    rows = []
    for _, r in df.iterrows():
        appid = str(r.get('App ID', '')).strip()
        apiname = str(r.get('API Name', '')).strip()

        step_link = STEP_TEMPLATE.format(app=appid, api=apiname)
        video_link = VIDEO_TEMPLATE.format(app=appid, api=apiname)
        sim_link = SIM_TEMPLATE.format(app=appid, api=apiname)

        rows.append({
            'Product Name': r.get('Product Name', ''),
            'Module Name': r.get('Module Name', ''),
            'App ID': appid,
            'Guide Name': r.get('Guide Name', ''),
            'API Name': apiname,
            'Step Link': step_link,
            'Video Link': video_link,
            'Simulation Link': sim_link,
        })

    return {"rows": rows}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
