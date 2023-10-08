import requests
from bs4 import BeautifulSoup
import csv 


#Methode die den html-Code generiert
def get_html(url):
    response = requests.get(url)
    return response.text

#Methode die doppelte Einträge verhindert
def search_string_in_csv(file_name, search_string):
    with open(file_name, 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            for cell in row:
                if search_string == cell:
                    return True
    return False


#Der html-Code wird in den wichtigen Teil selektiert. 
#Danach werden die Adressen der Module generiert und abgelaufen. 
#Beim Ablaufen werden die gewünschten Infos aus dem Code gezogen
#Die Infos werden am Ende in eine CSV-Datei geschrieben
#Eine CSV-Datei ist für die Teacher und eine ist für die Module
def htmlToCsv(subjectArea, studie, link):
    teacher = []
    subjectAreaTeacher = "teacher"+subjectArea+"Current.csv"
    studiemoduls = "module"+studie+"Current.csv"
    faculty = subjectArea
    degree = studie


    url = link
    html = get_html(url)
    string = html

    delimiter = '<table class="table table-striped" id="Subjects-list">'
    result = delimiter.join(string.split(delimiter)[1:])

    delimiter2 = '<div class="limit">Anzeige #<select id="limit" name="limit" class="inputbox input-mini" size="1" onchange="this.form.submit()">'
    result2 = delimiter2.join(result.split(delimiter2)[:1])

    delimiter3 = '<tbody >'
    result3 = delimiter3.join(result2.split(delimiter3)[1:])

    delimiter4 = '<tfoot>'
    result4 = delimiter4.join(result3.split(delimiter4)[:1])


    soup = BeautifulSoup(result4, 'html.parser')


    a_tags = soup.find_all('a')

    website_adressen = []
    for a in a_tags:
        href = a['href']
        if href not in website_adressen:  
            website_adressen.append(href)


    csv_file = open("moduleAll.csv", 'a', newline='', encoding='utf-8')
    writer = csv.writer(csv_file, delimiter='|')

    csv_file2 = open("teacher.csv", 'a', newline='', encoding='utf-8')
    writer2 = csv.writer(csv_file2, delimiter='|')

    headTextTeacher = 'teachername'
    headTextModul = "number|name|description|creditpoints|teachername|address|requirement|semester|faculty|degree"
    
    checkHeadTeacher = search_string_in_csv("teacher.csv", headTextTeacher)
    checkHeadModul = search_string_in_csv("moduleAll.csv", headTextModul)

    if checkHeadTeacher == False:
        writer2.writerow([headTextTeacher])

    if checkHeadModul == False:
        writer.writerow(['number','name', 'description', 'creditpoints', 'teachername', 'address', 'requirement', 'semester', 'faculty','degree'])


    #writer.writerow(['number','name', 'description', 'creditpoints', 'teachername', 'address', 'requirement', 'semester', 'faculty','degree'])

    for adresse in website_adressen:
        #print(adresse)

  
        url = adresse
        html = get_html(url)
        string = html

   
        soup = BeautifulSoup(string, 'html.parser')

        title_element = soup.find('h1', class_='page-title')
        modell_name = title_element.text.strip()
        modul = modell_name.split(maxsplit=1)

        modellnummer = modul[0]
        modellname = modul[1]
    

        modulverantwortliche_element = soup.find('div', class_='attribute-label', string='Modulverantwortliche')
        modulverantwortliche = ""

        if modulverantwortliche_element:
            modulverantwortliche_sibling = modulverantwortliche_element.find_next_sibling('div')
            if modulverantwortliche_sibling:
                modulverantwortliche = modulverantwortliche_sibling.text.strip()

        if not modulverantwortliche:
            modulverantwortliche = "Keine"

        lehrende_element = soup.find('div', class_='attribute-label', string='Lehrende')
        lehrende = []

        if lehrende_element:
            lehrende_sibling = lehrende_element.find_next_sibling('div')
            if lehrende_sibling:
                lehrende = [item.text for item in lehrende_sibling.find_all('li')]

        if not lehrende:
            lehrende = ['Keine']

        vorausgesetzte_module_element = soup.find('div', class_='attribute-label', string='Vorausgesetzte Module')
        vorausgesetzte_module = []
        if vorausgesetzte_module_element:
            vorausgesetzte_module_sibling = vorausgesetzte_module_element.find_next_sibling('div')
            if vorausgesetzte_module_sibling:
                vorausgesetzte_module = [item.text for item in vorausgesetzte_module_sibling.find_all('li')]
        if not vorausgesetzte_module:
            vorausgesetzte_module = ['Keine']

        kurzbeschreibung_element = soup.find('div', class_='attribute-label', string='Kurzbeschreibung')
        kurzbeschreibung = ""

        if kurzbeschreibung_element:
            kurzbeschreibung_sibling = kurzbeschreibung_element.find_next_sibling('div')
            if kurzbeschreibung_sibling:
                kurzbeschreibung = kurzbeschreibung_sibling.text.strip()

        if not kurzbeschreibung:
            kurzbeschreibung = "Keine"

        stud_semester_element = soup.find('div', class_='attribute-label', string='Studiensemester')
        stud_semester = ""

        stud_semester_element = soup.find('div', class_='attribute-label', string='Studiensemester')
        stud_semester = ""

        if stud_semester_element:
            stud_semester_sibling = stud_semester_element.find_next_sibling('div')
            if stud_semester_sibling:
                stud_semester = stud_semester_sibling.text.strip()
                if stud_semester == "Informatik (B.Sc. 2010) - 1. Semester":
                    stud_semester = 1
                elif stud_semester == "Informatik (B.Sc. 2010) - 2. Semester":
                    stud_semester = 2
                elif stud_semester == "Informatik (B.Sc. 2010) - 3. Semester":
                    stud_semester = 3
                else:
                    stud_semester = 4

        if not stud_semester:
            stud_semester = 4

        ectsLeistungspunkte_element = soup.find('div', class_='attribute-label', string='ECTS-Leistungspunkte (CrP)')
        ectsLeistungspunkte = []

        if ectsLeistungspunkte_element:
            ectsLeistungspunkte_sibling = ectsLeistungspunkte_element.find_next_sibling('div')
            if ectsLeistungspunkte_sibling:
                ectsLeistungspunkte = [item.text for item in ectsLeistungspunkte_sibling.find_all('li')]

        if not ectsLeistungspunkte:
            ectsLeistungspunkte = ['Keine']

        crp_values = [item.split(' ')[0] for item in ectsLeistungspunkte if 'CrP' in item]

        # Informationen in die CSV-Datei schreiben
        writer.writerow([modellnummer, modellname, kurzbeschreibung, ', '.join(crp_values), modulverantwortliche, adresse, ', '.join(vorausgesetzte_module), stud_semester, faculty, degree])
        
    
    
        if modulverantwortliche not in teacher:
            teacher.append(modulverantwortliche)

        for lehrer in lehrende:
            if lehrer not in teacher:
                teacher.append(lehrer)


    for name in teacher:
        checkBodyText = search_string_in_csv("teacher.csv", name)
        if checkBodyText == False:
            writer2.writerow([name])

    csv_file.close()
    csv_file2.close()


#Die Methode überprüft ob es Änderungen bei den CSV-Dateien gibt.
def checkChanges(currentPathTeacher, newPathTeacher, currentPathModul, newPathModul):
    file1_path = newPathTeacher
    file2_path = currentPathTeacher

    with open(file1_path, 'r') as file1, open(file2_path, 'r+') as file2:
        file1_data = file1.readlines()
        file2_data = file2.readlines()
    
        if file1_data == file2_data:
            print("Die Lehrer sind identisch.")
        else:
            print("Die Dateien sind nicht identisch. Der Inhalt von file1 wird in file2 geschrieben.")
            file2.seek(0)  # Zurücksetzen des Dateizeigers von file2 auf den Anfang der Datei
        
            for line in file1_data:
                file2.write(line)
        
            file2.truncate()  # Kürzen des Inhalts von file2 auf die Länge des neuen Inhalts von file1
        
            print("Der Inhalt von file1 wurde in file2 geschrieben.")

    file1_path = newPathModul
    file2_path = currentPathModul

    with open(file1_path, 'r',encoding='utf-8') as file1, open(file2_path, 'r+',encoding='utf-8') as file2:
        file1_data = file1.readlines()
        file2_data = file2.readlines()
    
        if file1_data == file2_data:
            print("Die Dateien sind identisch.")
        else:
            print("Die Dateien sind nicht identisch. Der Inhalt von file1 wird in file2 geschrieben.")
            file2.seek(0)  # Zurücksetzen des Dateizeigers von file2 auf den Anfang der Datei
        
            for line in file1_data:
                file2.write(line)
        
            file2.truncate()  # Kürzen des Inhalts von file2 auf die Länge des neuen Inhalts von file1
        
            print("Der Inhalt von file1 wurde in file2 geschrieben.")


#Alle Fachbereiche und deren Studiengänge werden abgelaufen und deren Links gespeichert.
url = 'https://www.thm.de/organizer/'
html = get_html(url)
soup = BeautifulSoup(html, 'html.parser')

start_section = 'Modulkataloge'
end_section = 'Curricula'

start_found = False

data_list = []  # Liste zur Speicherung der Daten

sections = soup.find_all('li', class_='type-heading')
for section in sections:
    title = section.find('span', class_='item-title').text
    title = title.replace(" ", "")
    
    if title == start_section:
        start_found = True
        continue  # Überspringe die erste Iteration, um den ersten Titel zu überspringen
        
    if start_found and title != end_section:
        # Erstellen eines Dictionaries für den aktuellen Titel
        title_data = {'title': title, 'subtitles': [], 'links': []}
        
        sub_items = section.find_next('ul').find_all('li', recursive=False)
        for sub_item in sub_items:
            sub_title = sub_item.find('span', class_='item-title').text

            
            sub_title = sub_title.replace(" ", "")
            title_data['subtitles'].append(sub_title)
            
            link = sub_item.find('a')
            if link:
                href = "https://www.thm.de" + link['href']  # Link bearbeiten
                title_data['links'].append(href)
        
        # Hinzufügen des aktuellen Titel-Datensatzes zur Datenliste
        data_list.append(title_data)
    
    if title == end_section:
        break

#für jeden Studiengang werden die Teacher und Module in CSV-Dateien gespeichert
for data in data_list:
    for subtitle, link in zip(data['subtitles'], data['links']):
        htmlToCsv(data['title'],subtitle, link )







