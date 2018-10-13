import markdown, re, os, yaml
from jsmin import jsmin
from csscompressor import compress

# read markdown article
with open('article.md', encoding='utf-8') as text:
    parts = text.read().split('---')
    header = parts[0]
    main = parts[1]

art = yaml.load(header)

#read options
options = art['options'].split(", ")

#names of authors
tmp = ', '.join(art['authors'])
art['authors'] = ' a '.join(tmp.rsplit(', ', 1))


# format external JS links
tmp = ''

libraries = {'jquery': 'https://unpkg.com/jquery@3.2.1'}

for lib in art['libraries']:
    if lib in libraries: lib = libraries[lib]
    tmp += '<script src="{0}"></script>\n'.format(lib)
art['libraries'] = tmp


# format external CSS links 
tmp = ''
for style in art['styles']:
    tmp += '<link rel="stylesheet" type="text/css" href="{0}">\n'.format(style)
art['styles'] = tmp


# <wide> pseudotag
main = main.replace('<wide>','</div><div class="row-main row-main--article">')
main = main.replace('</wide>','</div><div class="row-main row-main--narrow">')

# <left> <right> boxes pseudotag 
main = main.replace('<left>','<div class="b-inline b-inline--left"><div class="b-inline__wrap"><div class="b-inline__content"><div class="text-sm">')
main = main.replace('</left>','</div></div></div></div>')

main = main.replace('<right>','<div class="b-inline b-inline--right"><div class="b-inline__wrap"><div class="b-inline__content"><div class="text-sm">')
main = main.replace('</right>','</div></div></div></div>')


# article content
art['content'] = markdown.markdown(main)


#read snowfall template
if "noheader" in options: 
    template_file = './templates/snowfall_noheader.html'
    if "nopic" in options:
        art['mainphoto'] = ""
    else:
        art['mainphoto'] = '<figure class="b-detail__img"><img src="' + art['coverimg'] + '" width="100%" /><figcaption>' + art['coverimg_note'] + '</figcaption></figure>'
else: 
    template_file = './templates/snowfall.html'
with open(template_file, encoding='utf-8') as t:
    template = t.read()

# option: wide
if "wide" in options: 
    art['column'] = "<div class=\"row-main row-main--article\">"
else:
    art['column'] = "<div class=\"row-main row-main--narrow\">"

# pack styles
temp = ''
for style in os.listdir('./styles/'):
    with open('./styles/' + style, encoding='utf-8') as css_file:
        csmin = compress(css_file.read())
        temp += csmin

art['styles'] = art['styles'] + "<style>"+ temp + "</style>"

# fill template
for variable in re.findall(r"\{(\w+)\}", template):
    template = template.replace('{' + variable + '}', str(art[variable]))

# pack JSscripts
temp = ''
for script in os.listdir('./js/'):
    with open('./js/' + script, encoding='utf-8') as js_file:
        jmin = jsmin(js_file.read())
        temp += jmin

template = template + '<script>' + temp + '</script>\n' 

# write template
with open('./output.html', 'w', encoding='utf-8') as f:
    f.write(template)

# write wrapped content into dummy index
with open('./templates/wrapper.html', encoding='utf-8') as t:
    wrapper = t.read()
    
wrapper = wrapper.replace('{content}', template)

with open('./index.html', 'w', encoding='utf-8') as f:
    f.write(wrapper)
