# My Study Assist
The "My Study Assist" is an assistant for students enrolled in MNI subjects at THM. The main purpose of the responsive web application is to make everyday university life easier for students. Therefore it is possible for students to plan their studies completely and to be informed about possible stumbling blocks. Core elements are also the creation of personalized timetables and the overview of achievements. The topic of grades and achievements is a key focus. Students can view their current as well as future average grades. The achieved credit points and the grade in percent but also the classical average are displayed.
This task is done in groups of 4. I was in charge of Frontend development and helped a little with Backend.

## Members and roles
| Member | Role |
| ------ | ------ |
| Andryani, Linda Septira | Frontend |
| Jindra Philipp | Backend |
| Kirana, Yohanes Ranandika (Me)| Frontend |
| Küchler, Marcel | Backend |

## Features
Must Have:

- In order to use the features of My Study Assist, there must be a login.
- There is a page that displays prerequisites or module descriptions of available modules.
- Add new activity esp. timetable and exam schedule.
Export grade list in PDF format.
- Students can add their received grades to the score.
- Grades can be displayed by percentage or by number.
- My Study Assist is also fully functional on mobile.
- Ease of use
- There are 3 available languages (English, German and Bahasa).
- Interoperability - e.g. integrate information from different applications of THM: timetable; information about modules.
- Conformity of functionality - e.g. with data protection standard (DSGVO).

Nice to Have:

- Students can simulate or plan the grades to be received to get the desired grade point average.
- For comparison between received and simulated grades, the developer has divided under two different tables. One table is the state grade and another is the simulated table.
- The average of all grades received by students for the corresponding module is displayed. The goal is that students can compare their grade with this average.

## Languages and technologies  
### Operating system used:
- Ubuntu 22.04

### Languages used:
- HTML
- bootstrap
- Javascript
- CSS
- Typescript
- Python
- PSQL

### Technologies used:
- NodeJS ([https://nodejs.org/en])
- AngularJS v16 ([https://angular.io/](https://angular.io/))
- NGINX ([https://www.nginx.com/](https://www.nginx.com/))
- PostgreSQL ([https://www.postgresql.org/](https://www.postgresql.org/))
- PgAdmin ([https://www.pgadmin.org/])
- EmailJS ([https://www.emailjs.com/])
- DJANGO ([https://www.djangoproject.com/])
- Docker ([https://www.docker.com/])
- Font-Awesome ([https://fontawesome.com/])
- Full-Calendar ([https://fullcalendar.io/])
- Ubuntu 22.04

## Preparations
There are several things that need to be prepared.

### Setup Angular and NPM 
|Requirements|Yes|
|---|---|
|NodeJs|[NodeJs Installation](https://nodejs.org)|
|Angular CLI|`$ npm install -g @angular/cli`|

### Setup Git
|Operating System|---|
|---|---|
|Windows|[Git setup for Windows](https://gitforwindows.org/)|
|MacOS|[Git setup for MacOs](https://git-scm.com/download/mac)|
|Linux: Ubuntu/Debian|`$ sudo apt install git`|

# Working and deployment

## Working and deploy on local repository
> Requirement: [SSH Key](https://git.thm.de/profile/keys)

|Step | Linux Terminal Command  |
|---|---|
|1. Clone the remote repository |`sudo git clone git@git.thm.de:dhdd19/notenverwaltung.git`  |
|2. Switch to branch "Main"|`sudo git switch main`|
|3. Move inside the local repository    | `cd notenverwaltung`  |
|4. Move inside the directory public|`cd public`|
|5. Install npm package dependencies    | `sudo npm install` |
|6. Serve using localhost|`sudo ng serve -o`|

## Test deploy on THM Server (MSA2) using docker
> Requirement: [SSH Key](https://git.thm.de/profile/keys) and [Docker](https://git.thm.de/lsan07/cards-andryani/-/blob/staging/.docker/docker_readme.md)
> IP Server: `http://10.48.18.222`

### VPN Configuration

- [ ] THM VPN [Configuration](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) documentation
- [ ] Download `anyconnect cisco`
- [ ] Connect to `vpn.thm.de`
- [ ] Login to MSA Server 2 using terminal `ssh swtp@msa2.mni.thm.de`

|Step | Linux Terminal Command  |
|---|---|
|1. Clone the remote repository |`sudo git clone git@git.thm.de:dhdd19/notenverwaltung.git`  |
|2. Switch to branch "Main"|` sudo git switch main`|
|3. Move inside the local repository    | `cd notenverwaltung`  |
|4. Move inside the directory public|`cd public`|
|5. Install npm package dependencies    | `sudo npm install` |
|6. Build app|`sudo ng build --configuration=production`|

### Configure Docker (If not exist)
> This is a configuration for deployment using NGINX image

|If not exist | Linux Terminal Command  |
|---|---|
|docker network |`sudo docker network create --name [network_name]`  |
|NGINX image|`sudo docker pull nginx:latest`|
|config| `sudo nano /path/to/notenverwaltung/public/src/myapp.conf` |

Inside myapp.conf
```
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
}
```

### Docker command run
```
$ sudo docker run -d --name [container-name] --network [network-name] -v /path/to/notenverwaltung/public/dist/public:/usr/share/nginx/html -v /path/to/notenverwaltung/public/src/myapp.conf:/etc/nginx/conf.d/default.conf -p 8000:80 nginx:latest
```
`Access using browser http://10.48.18.222:8000`


> IF the link doesn't work
- [ ] Keep connected to `vpn.thm.de`
- [ ] Login to MSA Server 2 using terminal `ssh swtp@msa2.mni.thm.de`
- [ ] Restart the docker container by `sudo docker stop [container-name]` and `sudo docker rm [container-name]`
- [ ] Rerun the container using the command already mentioned
