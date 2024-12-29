[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br /> 
<div align="center">
  <a href="https://github.com/akash85246/ShelfWise">
    <img src="./public/icons/SHELFWISEICON.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">SHELFWISE</h3>

  <p align="center">
    An awesome personal book review platform where user can share his reviews of books.
    <br />
    <a href="https://github.com/akash85246/ShelfWise/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/akash85246/ShelfWise/issues/new?labels=enhancement">Request Feature</a>
    .
    <a href="https://github.com/akash85246/ShelfWise/blob/main/CONTRIBUTING.md">Contribute</a>
    .
    <a href="https://github.com/akash85246/ShelfWise/pulls">Pull Requests</a>
    .
    <a href="https://github.com/akash85246/ShelfWise/security">Report Security Issue</a>
    .
    <a href="https://github.com/akash85246/ShelfWise/fork">Fork the Project</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#additional-notes">Additional Notes</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://shelfwise-qrv8.onrender.com/)

A personal book review platform where user can share his reviews of books. The site integrates Google Authentication for user sign-in and displays book cover images via the Open Library API. Built with Node.js, EJS for templating, PostgreSQL for the database, and styled with modern CSS techniques.

### Features

- **Google Authentication**: Sign in seamlessly using your Google account.
- **Book Reviews**: Users can add, edit, and view detailed book reviews.
- **Book Covers**: Automatically fetches book cover images from the Open Library API.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Read Later Book List**: Save books to a personalized "Read Later" list for future reference.
- **Notifications for Upcoming Book Releases**: Get notified about books on their release dates.
- **Monthly Review Streak Tracker**: Track how many book reviews user post each month to maintain a streak.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [![Express][Express.js]][Express-url]
* [![Node][Node.js]][Node-url]
* [![Vue][Postgres]][Postgresql-url]
* [![Render][Render]][Render-url]
* [![Git][Git]][Git-url]
* [![GitHub][GitHub]][GitHub-url]
* [![CSS][CSS]][CSS-url]
* [![EJS][EJS]][EJS-url]
* [![Google Auth][GoogleAuth]][GoogleAuth-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js**: [Download Node.js](https://nodejs.org/) (LTS version recommended)
- **PostgreSQL**: Install and configure PostgreSQL for database management ([Download PostgreSQL](https://www.postgresql.org/download/)).
- **npm or yarn**: Comes with Node.js; used to install project dependencies.
- **Git**: [Download Git](https://git-scm.com/) to clone the repository.
- **Render Account**: If deploying on Render, create a free account at [Render](https://render.com).
- **Google Cloud Project**: Set up a Google Cloud project for Google Authentication ([Guide](https://developers.google.com/identity)).
- **Open Library API**: No additional setup required, but familiarize yourself with their API if needed ([Open Library API Docs](https://openlibrary.org/dev/docs/api/covers)).

Ensure you also have a basic understanding of the following:
- **EJS**: Templating engine for rendering dynamic views.
- **CSS**: For styling and responsive design adjustments.

### Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/akash85246/ShelfWise.git
   cd SHELFWISE

2. Install Dependencies
    ```sh
   npm install
   ```
3. Set Up Environment Variables
   ```env 
    DB_HOST=your_database_host
    DB_PORT=your_database_port
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_DATABASE=your_database_name

    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    SESSION_SECRET=your_session_secret

    EMAIL=your_email
    EMAIL_PASSWORD=your_email_password

    BASE_URL=your_base_url
   ```
4. Set Up the Database
   ```sql
    -- Table for storing book reviews
    CREATE TABLE book_reviews (
    id SERIAL PRIMARY KEY,
    title CHARACTER VARYING(255) NOT NULL UNIQUE,
    slug CHARACTER VARYING(255) NOT NULL UNIQUE,
    author CHARACTER VARYING(255),
    setting_rating INTEGER CHECK (setting_rating >= 0 AND setting_rating <= 5),
    plot_rating INTEGER CHECK (plot_rating >= 0 AND plot_rating <= 5),
    character_rating INTEGER CHECK (character_rating >= 0 AND character_rating <= 5),
    style_rating INTEGER CHECK (style_rating >= 0 AND style_rating <= 5),
    engagement_rating INTEGER CHECK (engagement_rating >= 0 AND engagement_rating <= 5),
    note TEXT,
    quote TEXT,
    moment TEXT,
    favorite_character CHARACTER VARYING(255),
    least_favorite_character CHARACTER VARYING(255),
    ending TEXT,
    start_date DATE,
    end_date DATE,
    genre CHARACTER VARYING(100),
    format CHARACTER VARYING(50),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    final_rating INTEGER CHECK (final_rating >= 0 AND final_rating <= 5),
    views INTEGER DEFAULT 0,
    moment_page_number INTEGER CHECK (moment_page_number > 0),
    cover_url TEXT,
    isbn CHARACTER VARYING(13),
    publisher TEXT,
    published_year INTEGER
    );

    -- Table for authorized users (authors or admins)
    CREATE TABLE authorized_users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    profile_picture TEXT,
    author BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Table for readers (general users)
    CREATE TABLE readers (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Table for tracking reader views on book reviews
    CREATE TABLE reader_views (
    id SERIAL PRIMARY KEY,
    reader_id INT NOT NULL, 
    review_id INT NOT NULL, 
    view_count INT DEFAULT 1,
    last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (reader_id) REFERENCES readers(id) ON DELETE CASCADE,
    FOREIGN KEY (review_id) REFERENCES book_reviews(id) ON DELETE CASCADE
    );

    -- Function to update the "updated_at" column
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Trigger for updating "updated_at" on reader_views table
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON reader_views
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    -- Table for storing "to-be-read" books
    CREATE TABLE to_be_read (
    id SERIAL PRIMARY KEY,           
    title VARCHAR(255) NOT NULL,     
    author VARCHAR(255) NOT NULL,   
    type VARCHAR(100) NOT NULL,      
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    );

    -- Table for tracking recommendations
    CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,    
    ip_address INET NOT NULL,        
    book_review_id INTEGER NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_book_review FOREIGN KEY (book_review_id) 
    REFERENCES book_reviews (id) ON DELETE CASCADE
    );

    -- Table for anticipated books
    CREATE TABLE anticipated_books (
    id SERIAL PRIMARY KEY,               
    title VARCHAR(255) NOT NULL UNIQUE,         
    author VARCHAR(255) NOT NULL,         
    release_date DATE NOT NULL,           
    cdn_link TEXT NOT NULL,               
    emoji VARCHAR(10),                    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    );

    -- Trigger for updating "updated_at" on anticipated_books table
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON anticipated_books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
   ```
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```
6. Run the Project
    ```sh
   nodemon app.js
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Once the project is running, you can use the following features:

1. **Google Authentication**
   - Click the "Sign In with Google" button on the homepage.
   - Sign in using your Google account to access your personalized dashboard.

2. **Add Book Reviews**
   - Navigate to the "New" in navigation bar.
   - Enter the book details (title, author, review, etc.).
   - Submit your review, which will be saved and displayed on the main page.

3. **View Book Reviews**
   - Browse the homepage to see all the book reviews shared by you.
   - Click on a book to view its details.
   - Additionally you can search it by name in searchbar at homepage

4. **Read Later List**
   - Mark a book as "Read Later" by clicking the "Read Later" in navigation bar.
   - Access your list in the "Read Later" section from the navigation bar.

5. **Book Covers**
   - The app automatically fetches book cover images using the Open Library API.
   - If no cover is available, a placeholder image will be shown.

6. **Notification for Upcoming Book Releases**
   - You can add books to "Anticipated" in navigation bar. 
   - If a book in your list has an upcoming release date, you will receive an email notification on the release day.

7. **Monthly Streak**
   - Track how many book reviews you’ve added in a month.
   - View your streak on your "Streak" in navigation bar.

8. **Responsive Design**
   - Use the site on both desktop and mobile devices without any issues.


## Additional Notes

- **Database**: Ensure that your PostgreSQL database is running and properly seeded with initial data if required.
- **Deployment**: The project can also be deployed to platforms like Render for wider access.
- **Customization**: Modify the `.env` file for custom configurations such as port, Google credentials, or database URLs.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
<!-- ROADMAP -->
## Roadmap

Here are the planned improvements and features for the project:

- [x] Google Authentication for user login.
- [x] Book review management (add, edit, delete reviews).
- [x] Automatic fetching of book covers using the Open Library API.
- [x] Email notifications for upcoming book releases.
- [x] Responsive design for both desktop and mobile devices.
- [x] Add a "Top Reviewed Books" section on the homepage.
- [x] Implement search functionality to filter book reviews.
- [ ] Add support for social sharing of book reviews.
- [ ] Enable users to rate books and view average ratings.
- [ ] Introduce dark mode for better accessibility.
- [ ] Include multi-language support for a global audience.
- [ ] Integrate a recommendation system based on user preferences.

See the [open issues](https://github.com/akash85246/ShelfWise/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. **Fork the Project**
   - Click the "Fork" button at the top-right corner of this page to create a copy of the repository in your GitHub account.

2. **Clone the Repository**
   - Clone your forked repository to your local machine:
     ```bash
     git clone https://github.com/your-username/ShelfWise.git
     ```

3. **Create Your Feature Branch**
   - Navigate to your project folder and create a new branch for your feature:
     ```bash
     git checkout -b feature/AmazingFeature
     ```

4. **Commit Your Changes**
   - After making the necessary changes, commit them:
     ```bash
     git commit -m 'Add some AmazingFeature'
     ```

5. **Push to the Branch**
   - Push your changes to your forked repository:
     ```bash
     git push origin feature/AmazingFeature
     ```

6. **Open a Pull Request**
   - Go to the original repository (`akash85246/ShelfWise`), and open a pull request to merge your feature branch into the `main` branch.
   - Provide a brief description of the changes you've made and submit the pull request for review.

### Top contributors:

<a href="https://github.com/akash85246/ShelfWise/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=akash85246/ShelfWise" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Akash Rajput - [@akash_rajp91025](https://x.com/akash_rajp91025) - akash.rajput.dev@gmail.com

Project Link: [https://github.com/akash85246/ShelfWise](https://github.com/akash85246/ShelfWise)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

I would like to extend my gratitude to the following resources and individuals:

- **Open Library API** – For providing the book cover images and book data.
- **Google** – For offering the Google Authentication API that allows users to sign in securely.
- **PostgreSQL** – For providing the database solution for managing user data and book reviews.
- **Render** – For hosting the project online and making deployment seamless.
- **Tailwind CSS** – For its utility-first CSS framework that helped design the responsive layout.
- **Node.js** – For being the foundation of the backend server.
- **Express.js** – For making routing and server-side development efficient and easy.
- **EJS** – For templating and rendering dynamic views.
- **Loaders.css** – For providing an easy-to-implement loader to enhance user experience during page loads.
- **App Brewery** – For providing educational resources and inspiration for building full-stack applications.
- **Udemy** – For offering valuable courses that helped deepen my understanding of web development.
- **Angela Yu** – For being an amazing instructor whose courses on Udemy have greatly contributed to my learning and growth in web development.



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/akash85246/ShelfWise.svg?style=for-the-badge
[contributors-url]: https://github.com/akash85246/ShelfWise/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/akash85246/ShelfWise.svg?style=for-the-badge
[forks-url]: https://github.com/akash85246/ShelfWise/network/members
[stars-shield]: https://img.shields.io/github/stars/akash85246/ShelfWise.svg?style=for-the-badge
[stars-url]: https://github.com/akash85246/ShelfWise/stargazers
[issues-shield]: https://img.shields.io/github/issues/akash85246/ShelfWise.svg?style=for-the-badge
[issues-url]: https://github.com/akash85246/ShelfWise/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/akash-rajput-68226833a/
[product-screenshot]: ./public/images/shelfwiseHome.png
[Express.js]: https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white
[Postgres]: https://img.shields.io/badge/Postgres-336791?style=flat&logo=postgresql&logoColor=white
[Render]: https://img.shields.io/badge/Render-343a40?style=flat&logo=render&logoColor=white
[Git]: https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white
[GitHub]: https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white
[CSS]: https://img.shields.io/badge/CSS-1572B6?style=flat&logo=css3&logoColor=white
[EJS]: https://img.shields.io/badge/EJS-49B58E?style=flat&logo=ejs&logoColor=white
[GoogleAuth]: https://img.shields.io/badge/Google_Auth-4285F4?style=for-the-badge&logo=google


[Express-url]: https://expressjs.com/
[Node-url]: https://nodejs.org/
[Postgresql-url]: https://www.postgresql.org/
[Render-url]: https://render.com/
[Git-url]: https://git-scm.com/
[GitHub-url]: https://github.com/
[CSS-url]: https://developer.mozilla.org/en-US/docs/Web/CSS
[EJS-url]: https://ejs.co/
[GoogleAuth-url]: https://developers.google.com/i