import requests
import markdown

URI = "https://raw.githubusercontent.com/HTR-United/htr-united/master/reuse-charter.md"

req = requests.get(URI)
req.raise_for_status()

text = req.text


html = markdown.markdown(text)

with open("data-reuse-charter.templatehtml") as f:
	with open("data-reuse-charter.html", "w") as o:
		o.write(f.read().replace("{{data}}", html))
