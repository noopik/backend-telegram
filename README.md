<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/dwinovic/telegram-clone">
    <img src="https://res.cloudinary.com/dnv-images/image/upload/v1631893565/Telegram%20Clone/Frame_1_jnfh3u.svg" alt="Logo" width="500" height="180">
  </a>

  <h3 align="center">RESTful API for Telegram Clone </h3>

  <p align="center">
    Telegram clone is a web site-based two-way <br /> real-time chat communication application. 
    <br />
    <a href="https://github.com/dwinovic/backend-telegram"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://teleclone.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/dwinovic/backend-telegram">Report Bug</a>
    ·
    <a href="https://github.com/dwinovic/backend-telegram">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
        <ol>
            <li>
                <a href="#build-with">Build With</a>
            </li>
        </ol>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ol>
        <li>
          <a href="#installation">Installation</a>
        </li>
        <li>
          <a href="#prerequisites">Prerequisites</a>
        </li>
        <li>
          <a href="#related-project">Related Project</a>
        </li>
      </ol>
    </li>
    <li><a href="#blanja-api-documentation">Blanja API Documentation</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

<b>Telegram Clone</b> is a web site-based two-way <br /> real-time chat communication application.

### Build With
* [Express Js](https://expressjs.com/)
* [Node Js](https://nodejs.org/en/)
* [MySQL](https://www.mysql.com/)
* [Json Web Token](https://jwt.io/)
* [Nodemailer](https://nodemailer.com/about/)
* [Socket IO](https://socket.io/)

## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* [Node Js](https://nodejs.org/en/download/)
* [MySQL](https://www.mysql.com/downloads/)
* [Postman](https://www.postman.com/downloads/)

### Installation

1. Clone These 2 Repos (Backend and Frontend)
```sh
https://github.com/dwinovic/backend-telegram
```
2. Go To Folder Repo
```sh
cd backend-telegram
```
3. Install Module
```sh
npm install
```
4. Make a new database and import [telegram-db-structure-sample.sql](https://drive.google.com/file/d/1ZXEZyO_tt6THOxDSvtYvnfmDvC--7gyX/view?usp=sharing)
5. Add .env file at root folder project, and add following
```sh
DB_NAME = [DB_NAME]
DB_HOST = [DB_HOST]
DB_USER = [DB_USER]
DB_PASS = [DB_PASS]
PORT =4000
PRIVATE_KEY=[YOUR_PRIVATE_KEY_FOR_JWT_DECODE]
EMAIL_SERVICE=[YOUR_SMTP_EMAIL]
PASS_EMAIL_SERVICE=[EMAIL_PASS]
HOST_SERVER=[URL_LOCAL_BACKEND]
HOST_CLIENT=[URL_LOCAL_FRONTEND]
CLOUD_NAME=[YOUR_NAME_CLOUDINARY]
API_KEY=[YOUR_API_KEY_CLOUDINARY]
API_SECRET=[YOUR_API_SECRET_CLODINARY]
```
6. Starting application
```sh
npm run dev
```
7. Testing with Postman
    * [Telegram Clone Postman APIs Collection](https://documenter.getpostman.com/view/15390348/UUxtDVRf)

### Related Project

* [`Frontend Telegram Clone`](https://github.com/dwinovic/telegram-clone)
* [`Backend Telegram Clone`](https://github.com/dwinovic/backend-telegram)


## Blanja API Documentation

* [Telegram Clone Postman APIs Collection](https://documenter.getpostman.com/view/15390348/UUxtDVRf)

## Contact
My Email : novidwicahya19@gmail.com

Project Link: [https://github.com/dwinovic/backend-telegram](https://github.com/dwinovic/backend-telegram)
