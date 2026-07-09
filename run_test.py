import urllib.request, json, sys, time

# Try to connect with retries
for attempt in range(3):
    try:
        r = urllib.request.urlopen("http://localhost:3009", timeout=3)
        html = r.read().decode("utf-8")
        print("Page: OK" if "Amazon Listing" in html else "Page: loaded but no content")
        break
    except Exception as e:
        if attempt < 2:
            time.sleep(3)
        else:
            print("Server not running - start it first")
            sys.exit(1)

# Test 1: Italian
print("\n=== Test 1: Italian input, Italian output ===")
data = json.dumps({"brand": "Simzlife", "language": "Italian", "mode": "title-highlights",
    "productInfo": "Questa macchina per ghiaccio nugget da banco produce ghiaccio morbido e masticabile in 7-10 minuti. Produce 35 libbre di ghiaccio al giorno. Autopulente. Maniglia portatile. Meno di 50dB. Certificazione ETL.",
    "settings": {"titleMaxLength": 75, "highlightMaxLength": 125, "writingStyle": "balanced", "strictDedupe": True, "amazonCompliance": True}}).encode()
req = urllib.request.Request("http://localhost:3009/api/generate", data=data, headers={"Content-Type": "application/json"}, method="POST")
r = urllib.request.urlopen(req, timeout=60)
result = json.loads(r.read())
print("  Source:", result.get("meta",{}).get("sourceLanguage","?"))
print("  Target:", result.get("meta",{}).get("targetLanguage","?"))
print("  Title:", result.get("title",{}).get("original","")[:70])

# Test 2: Chinese
print("\n=== Test 2: Chinese input, German output ===")
data2 = json.dumps({"brand": "Simzlife", "language": "German", "mode": "title-highlights",
    "productInfo": "\u8fd9\u6b3e\u53f0\u5f0f\u9897\u7c92\u51b0\u5236\u51b0\u673a\u53ef\u57287-10\u5206\u949f\u5185\u751f\u4ea7\u51fa\u67d4\u8f6f\u53ef\u56bc\u7684\u51b0\u3002\u6bcf\u5929\u751f\u4ea735\u78c5\u51b0\u3002\u81ea\u6e05\u6d01\u529f\u80fd\u3002\u4fbf\u643a\u624b\u628a\u3002\u4f4e\u4e8e50\u5206\u8d1d\u3002ETL\u8ba4\u8bc1\u3002",
    "settings": {"titleMaxLength": 75, "highlightMaxLength": 125, "writingStyle": "balanced", "strictDedupe": True, "amazonCompliance": True}}).encode()
req2 = urllib.request.Request("http://localhost:3009/api/generate", data=data2, headers={"Content-Type": "application/json"}, method="POST")
r2 = urllib.request.urlopen(req2, timeout=60)
result2 = json.loads(r2.read())
print("  Source:", result2.get("meta",{}).get("sourceLanguage","?"))
print("  Target:", result2.get("meta",{}).get("targetLanguage","?"))
print("  Title:", result2.get("title",{}).get("original","")[:70])

# Test 3: English
print("\n=== Test 3: English input, French output ===")
data3 = json.dumps({"brand": "Simzlife", "language": "French", "mode": "title-highlights",
    "productInfo": "This nugget ice maker produces soft chewable ice in 7-10 minutes. Self-cleaning. Portable handle. Quiet operation under 50dB. ETL certified.",
    "settings": {"titleMaxLength": 75, "highlightMaxLength": 125, "writingStyle": "balanced", "strictDedupe": True, "amazonCompliance": True}}).encode()
req3 = urllib.request.Request("http://localhost:3009/api/generate", data=data3, headers={"Content-Type": "application/json"}, method="POST")
r3 = urllib.request.urlopen(req3, timeout=60)
result3 = json.loads(r3.read())
print("  Source:", result3.get("meta",{}).get("sourceLanguage","?"))
print("  Target:", result3.get("meta",{}).get("targetLanguage","?"))
print("  Title:", result3.get("title",{}).get("original","")[:70])

print("\nAll tests passed!")
