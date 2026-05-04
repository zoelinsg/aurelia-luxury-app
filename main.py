from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import asyncio

app = FastAPI(title="AURELIA Luxury Fashion API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Pydantic Models
class CartItem(BaseModel):
    id: int
    name: str
    price: float
    quantity: int

class CartData(BaseModel):
    items: List[CartItem]
    total: float

class ChatMessage(BaseModel):
    message: str

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

# Sample Products Data
PRODUCTS = [
    {
        "id": 1,
        "name": "Obsidian Silk Trench",
        "price": 1250.00,
        "imageUrl": "/static/images/prod1.jpg"
    },
    {
        "id": 2,
        "name": "Champagne Cashmere Knit",
        "price": 890.00,
        "imageUrl": "/static/images/prod2.jpg"
    },
    {
        "id": 3,
        "name": "Pure White Tailored Trousers",
        "price": 750.00,
        "imageUrl": "/static/images/prod3.jpg"
    },
    {
        "id": 4,
        "name": "Golden Accent Leather Tote",
        "price": 2100.00,
        "imageUrl": "/static/images/prod4.jpg"
    },
    {
        "id": 5,
        "name": "Midnight Velvet Blazer",
        "price": 1450.00,
        "imageUrl": "/static/images/prod5.jpg"
    },
    {
        "id": 6,
        "name": "Ivory Silk Blouse",
        "price": 680.00,
        "imageUrl": "/static/images/prod6.jpg"
    }
]

# Frontend Page Routes
@app.get("/")
async def read_index(request: Request):
    return templates.TemplateResponse(request, "index.html", {"request": request})

@app.get("/about")
async def read_about(request: Request):
    return templates.TemplateResponse(request, "about.html", {"request": request})

@app.get("/contact")
async def read_contact(request: Request):
    return templates.TemplateResponse(request, "contact.html", {"request": request})

@app.get("/checkout")
async def read_checkout(request: Request):
    return templates.TemplateResponse(request, "checkout.html", {"request": request})

# API Routes
@app.get("/products")
async def get_products():
    return PRODUCTS

@app.post("/process-payment")
async def process_payment(cart: CartData):
    await asyncio.sleep(2)  # Simulate 2-second delay
    return {"message": "Payment Successful", "status": "success"}

@app.post("/chat")
async def chat_interaction(chat: ChatMessage):
    user_msg = chat.message.lower()
    if "material" in user_msg:
        return {"reply": "Our pieces are crafted using only the finest Italian silk and hand-sourced cashmere, ensuring unparalleled luxury and comfort."}
    else:
        return {"reply": "Welcome to AURELIA. Our concierge is at your service. How may we assist you with your luxury wardrobe today?"}

@app.post("/contact-submit")
async def contact_submit(form: ContactForm):
    return {"message": f"Thank you, {form.name}. Your inquiry has been received by our concierge team."}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
