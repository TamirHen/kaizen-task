# Kaizen Task - Tamir Hen

Implementation for the technical task 

---
## Requirements

Node.js

### Node
- #### Node installation

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v16.13.1

    $ npm --version
    8.1.2

If you need to update `npm`, you can make it using `npm`. After running the following command, just open again the command line.

    $ npm install npm -g

###

---

## Install

    $ git clone https://github.com/TamirHen/kaizen-task.git
    $ cd kaizen-task
    $ npm install

## Configure app

Create .env file in the root directory and add the following:

    DATABASE_URL=replace_with_url_to_database
    SFTP_HOST=replace_with_sftp_host
    SFTP_USERNAME=replace_with_sftp_username
    SFTP_PASSWORD=replace_with_sftp_password
    API_URL=https://api.semrush.com/
    API_KEY=replace_with_api_key


### Extra settings
Open `config.js` file and edit it with your settings.

## Running the project

    $ npm start
