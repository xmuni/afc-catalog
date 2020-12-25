import csv
import os
import json


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



if __name__ == "__main__":
    parse_csv('items.csv')