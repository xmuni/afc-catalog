from jinja_renderer import render_template
from parse_csv import parse_csv
import os
import json



def get_imagenames(path):
    imgnames = []
    for filename in os.listdir(path):
        if filename.lower().endswith('.jpg'):
            imgnames.append(filename)
    return imgnames



def Main():

    headers = ['img','n.','art.','dim']

    '''
    items = [
        {
            'img':  ['01.jpg'],
            'n.':   ['123'],
            'art.': ['Quadrato'],
            'dim':  ['18 x 18', '25 x 25', '30 x 30'],
        },
        {
            'img':  ['02.jpg'],
            'n.':   ['456'],
            'art.': ['Rettangolo'],
            'dim':  ['24 x 12', '30 x 15', '40 x 20'],
        },
    ]
    '''

    # centered_columns = ['img', 'dim']

    header_translations = {
        'img':      '',
        'num':      'N. Articolo',
        'art':      'Nome',
        'finiture': 'Finiture',
        'dim':      'Dimensioni (cm)',
        'spess':    'Spessore (cm)',
        'cod_art':  'Codice articolo',

        'select':   'Seleziona',
    }

    headers,items_rows = parse_csv('./items.csv')

    listed_floors = {}
    with open('./attributes.json', 'r+', encoding='UTF-8') as file:
        listed_floors = json.loads(file.read())

    kwargs = {
        'headers':              headers,
        'items':                items_rows,
        'floors':               ['Depliant',    'img/floors/depliant',      get_imagenames('img/floors/depliant')],
        'floors_unlisted':      ['Non depliant','img/floors/not-depliant',  get_imagenames('img/floors/not-depliant')],
        'floors_main':          ['Pavimenti',  'img/floors/main',          get_imagenames('img/floors/main')],
        'listed_floors':        listed_floors,
        'header_translations':  header_translations,
    }

    # print('Listed floors:')
    # print(kwargs['listed_floors'])
    # return

    render_template('templates/template.html', output='./index.html', title='Articoli', **kwargs)
    print('OK')


    '''
        {% for cat in category_names %}
            
            <h3 id="{{ categories[cat]['codename'] }}">{{ categories[cat]['label'] }}</h3>

            <div class="category">
                {% for image in categories[cat]['images'] %}
                <a data-fancybox="gallery" href="img/{{ categories[cat]['codename'] }}/{{ image['path'] }}_h.jpg" data-caption="{{ image['caption'] }}">
                    <img data-caption="{{ image['caption'] }}" src="img/{{ categories[cat]['codename'] }}/{{ image['path'] }}_s.jpg">
                </a>
                {% endfor %}
            </div>

        {% endfor %}
    '''


if __name__ == "__main__":
    Main()
