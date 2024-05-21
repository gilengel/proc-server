from bs4 import BeautifulSoup
import requests
import json

url = "https://icons8.com/line-awesome"

page = BeautifulSoup(requests.get(url).text, "lxml")

output = { 'categories': [] }
for groups in page.find_all("div", {"class": "icons-group"}):

  headline = groups.find_all("h2")[0].text.strip()

  category = { 'name': headline, 'icons': [] }


  #print("{")
  #print("\tname:'" + headline + "',")
  #print("\ticons: [")
  for icons in groups.find_all("div", {"class": "icons__item"}):
    i = icons.find_all("i")[0]
    icon = ' '.join(i['class'])

    t = icons.find_all("div", {"class": "icons__text"})[0]

    text = t.text.strip()

    category['icons'].append({
      'name': text,
      'icon': icon
    })

  output['categories'].append(category)

with open("sample.json", "w") as outfile:
    json.dump(output, outfile)
  #  print("\t\tl'lab la-"+icons.text.strip()+"',")
  #print("\t]")
  #print("},")


