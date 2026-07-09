import urllib.request, json

# Test with Chinese input + German output
data = json.dumps({
    "brand": "Simzlife",
    "language": "German",
    "mode": "title-highlights",
    "productInfo": "\u8fd9\u6b3e\u53f0\u5f0f\u9897\u7c92\u51b0\u5236\u51b0\u673a\u53ef\u57287-10\u5206\u949f\u5185\u751f\u4ea7\u51fa\u67d4\u8f6f\u53ef\u56bc\u7684\u51b0\u3002\u6bcf\u5929\u751f\u4ea735\u78c5\u51b0\u3002\u81ea\u6e05\u6d01\u529f\u80fd\u3002\u4fbf\u643a\u624b\u628a\u3002\u4f4e\u4e8e50\u5206\u8d1d\u3002ETL\u8ba4\u8bc1\u3002",
    "settings": {"titleMaxLength": 75, "highlightMaxLength": 125, "writingStyle": "balanced", "strictDedupe": True, "amazonCompliance": True}
}).encode()

req = urllib.request.Request("http://localhost:3009/api/generate", data=data, headers={"Content-Type": "application/json"}, method="POST")
try:
    r = urllib.request.urlopen(req, timeout=60)
    result = json.loads(r.read())
    print("API:", r.status)
    print("Meta source:", result.get("meta",{}).get("sourceLanguage","?"))
    print("Meta target:", result.get("meta",{}).get("targetLanguage","?"))
    if "error" in result:
        print("Error:", result["error"][:200])
    else:
        print("Title:", result.get("title",{}).get("original","")[:80])
        print("Title zh:", result.get("title",{}).get("zh","")[:60])
except urllib.error.HTTPError as e:
    print("Error:", e.code, e.read().decode()[:300])
except Exception as e:
    print("Exception:", str(e)[:200])
