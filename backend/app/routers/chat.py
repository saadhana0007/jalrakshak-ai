from fastapi import APIRouter, Depends

from ..auth import require_role
from ..schemas import ChatRequest

router = APIRouter(tags=["chat"])

_RESPONSES = {
    "irrigate": {
        "en": "Based on current soil moisture (38%) and a 21mm rainfall forecast in the next 14 hours, I recommend delaying irrigation. This can save approximately 14,200 litres of water with 92% confidence.",
        "hi": "वर्तमान मिट्टी की नमी (38%) और अगले 14 घंटों में 21mm वर्षा के पूर्वानुमान के आधार पर, मैं सिंचाई में देरी की सलाह देता हूं। इससे लगभग 14,200 लीटर पानी की बचत हो सकती है।",
        "ta": "தற்போதைய மண் ஈரப்பதம் (38%) மற்றும் அடுத்த 14 மணி நேரத்தில் 21mm மழை பொழிவு கணிப்பின் அடிப்படையில், பாசனத்தை தாமதப்படுத்த பரிந்துரைக்கிறேன்.",
    },
    "delay": {
        "en": "Delaying irrigation is recommended because rainfall is expected soon, soil moisture is still above the critical threshold (25%), and irrigating now would waste water and increase runoff risk.",
        "hi": "सिंचाई में देरी की सिफारिश की जाती है क्योंकि जल्द ही वर्षा होने की उम्मीद है और मिट्टी की नमी अभी भी महत्वपूर्ण सीमा (25%) से ऊपर है।",
        "ta": "விரைவில் மழை எதிர்பார்க்கப்படுவதால் பாசனத்தை தாமதப்படுத்த பரிந்துரைக்கப்படுகிறது.",
    },
    "save": {
        "en": "Farms using JalRakshak's Smart Irrigation Advisor save an average of 22% water per season — roughly 14,200 litres per delayed irrigation event.",
        "hi": "जलरक्षक के स्मार्ट सिंचाई सलाहकार का उपयोग करने वाले खेत प्रति सीजन औसतन 22% पानी बचाते हैं।",
        "ta": "ஜல்ரக்ஷக்கின் ஸ்மார்ட் பாசன ஆலோசகரைப் பயன்படுத்தும் பண்ணைகள் ஒரு பருவத்திற்கு சராசரியாக 22% தண்ணீரை மிச்சப்படுத்துகின்றன.",
    },
    "default": {
        "en": "I can help you decide when to irrigate, explain climate alerts, and suggest water-saving measures. Try asking: \"Should I irrigate today?\"",
        "hi": "मैं आपको यह तय करने में मदद कर सकता हूं कि कब सिंचाई करनी है और जल-बचत उपाय सुझा सकता हूं।",
        "ta": "எப்போது பாசனம் செய்வது என்பதை முடிவு செய்ய உதவ முடியும்.",
    },
}


@router.post("/chat")
def chat_endpoint(payload: ChatRequest, user: dict = Depends(require_role("farmer", "admin"))):
    q = payload.message.lower()
    key = "default"
    if "irrigate" in q and "today" in q:
        key = "irrigate"
    elif "delay" in q or "why" in q:
        key = "delay"
    elif "save" in q or "how much" in q:
        key = "save"

    lang = payload.language if payload.language in ("en", "hi", "ta") else "en"
    return {
        "reply": _RESPONSES[key].get(lang, _RESPONSES[key]["en"]),
        "intent": key,
        "language": lang,
    }
