# My Study Assist
The "My Study Assist" is an assistant for students enrolled in MNI subjects at THM. The main purpose of the responsive web application is to make university life easier for students.

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
