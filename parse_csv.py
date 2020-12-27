import csv
import os
import json
import pandas as pd
import math


THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))



def row_is_empty(row):
    for value in row:
        if value != '':
            return False
    return True


def parse_csv(csv_path):
    with open(csv_path) as csv_file:
        csv_reader = csv.reader(csv_file)

        headers = []

        first = True
        buffer = []
        item_rows = []

        for row in csv_reader:

            if first:
                headers = row
                first = False
                # print('Headers:',headers)
                buffer = [[] for _ in range(len(headers))]

            elif row_is_empty(row):
                # print('Empty row. Saving buffer')
                # print(type(row))
                # print(row)
                new_item = {}
                for i in range(len(buffer)):
                    new_item[headers[i]] = buffer[i]
                item_rows.append(new_item)
                # print('Row saved:',new_item)
                buffer = [[] for _ in range(len(headers))]

            else:
                for i in range(len(headers)):
                    value = row[i]
                    if value != '':
                        buffer[i].append(value)

        # Save last item
        new_item = {}
        for i in range(len(buffer)):
            new_item[headers[i]] = buffer[i]
        item_rows.append(new_item)
        
        # print('-'*10)
        # for item_row in item_rows:
        #     print(item_row)

        return [headers,item_rows]

        # for key,value in rows:
            # print(key,value)


def isnan(number):
    return type(number)!=str and math.isnan(number)



def get_row(df,row):

    result = []
    buffer = []

    for i in range(len(df[row])):
        value = df[row][i]
        # print("Value:",value)
        if isnan(value):
            if len(buffer) > 0:
                result.append(buffer)
                buffer = []
        else:
            buffer.append(value)

    if len(buffer) > 0:
        result.append(buffer)

    return result


def row_set_to_dic(row_set):
    dic = {
        "name": row_set[0][0],
        "img": row_set[0][1],
        "options": [],
    }

    for option_group in row_set[1:]:
        option = {
            "label": option_group[0],
            "values": [],
            "default": 0,
        }
        counter = 0
        for str_value in option_group[1:]:
            if str_value.startswith('!'):
                option["default"] = counter
                option["values"].append(str_value[1:])
            else:
                option["values"].append(str_value)
            counter += 1
        dic["options"].append(option)
    
    return dic


def parse_floors_csv(path):
    sheet = pd.read_csv(path, header=None)

    # rows,cols = sheet.shape
    # print(rows,cols)

    # Pandas data frame (2d array)
    df = sheet.values
    # print(df)

    # print('Transposing csv table...')
    df_transposed = df.transpose()
    rows,cols = df_transposed.shape
    # print('Rows:',rows)
    # print('Cols:',cols)

    '''
    # Testing
    row_sets = get_row(df_transposed,0)
    for row_set in row_sets:
        print(row_set)

    print(row_set_to_dic(row_sets))
    '''

    output = []
    for row in range(rows):
        row_sets = get_row(df_transposed,row)
        output.append(row_set_to_dic(row_sets))
    # print(output)

    jsontext = json.dumps(output, indent=4)
    # print(jsontext)
    filename_json = 'attributes_output.json'
    with open(filename_json, 'w+', encoding='UTF-8') as file:
        file.write(jsontext)
        # print('Json saved:', filename_json)





if __name__ == "__main__":
    # parse_csv('items.csv')
    print('Parsing floors csv')
    parse_floors_csv('floors.csv')
