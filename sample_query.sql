CREATE TABLE IF NOT EXISTS public.book_reviews
(
    id integer NOT NULL DEFAULT nextval('book_reviews_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    slug character varying(255) COLLATE pg_catalog."default" NOT NULL,
    author character varying(255) COLLATE pg_catalog."default",
    setting_rating integer,
    plot_rating integer,
    character_rating integer,
    style_rating integer,
    engagement_rating integer,
    note text COLLATE pg_catalog."default",
    quote text COLLATE pg_catalog."default",
    moment text COLLATE pg_catalog."default",
    favorite_character character varying(255) COLLATE pg_catalog."default",
    least_favorite_character character varying(255) COLLATE pg_catalog."default",
    ending text COLLATE pg_catalog."default",
    start_date date,
    end_date date,
    genre character varying(100) COLLATE pg_catalog."default",
    format character varying(50) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    final_rating integer,
    views integer DEFAULT 0,
    moment_page_number integer,
    cover_url text COLLATE pg_catalog."default",
    isbn character varying(13) COLLATE pg_catalog."default",
    publisher text COLLATE pg_catalog."default",
    published_year integer,
    CONSTRAINT book_reviews_pkey PRIMARY KEY (id),
    CONSTRAINT book_reviews_slug_key UNIQUE (slug),
    CONSTRAINT book_reviews_title_key UNIQUE (title),
    CONSTRAINT book_reviews_character_rating_check CHECK (character_rating >= 1 AND character_rating <= 5),
    CONSTRAINT book_reviews_engagement_rating_check CHECK (engagement_rating >= 1 AND engagement_rating <= 5),
    CONSTRAINT book_reviews_final_rating_check CHECK (final_rating >= 1 AND final_rating <= 5),
    CONSTRAINT book_reviews_moment_page_number_check CHECK (moment_page_number > 0),
    CONSTRAINT book_reviews_plot_rating_check CHECK (plot_rating >= 1 AND plot_rating <= 5),
    CONSTRAINT book_reviews_setting_rating_check CHECK (setting_rating >= 1 AND setting_rating <= 5),
    CONSTRAINT book_reviews_style_rating_check CHECK (style_rating >= 1 AND style_rating <= 5),
    CONSTRAINT character_rating_check CHECK (character_rating >= 0 AND character_rating <= 5),
    CONSTRAINT engagement_rating_check CHECK (engagement_rating >= 0 AND engagement_rating <= 5),
    CONSTRAINT final_rating_check CHECK (final_rating >= 0 AND final_rating <= 5),
    CONSTRAINT plot_rating_check CHECK (plot_rating >= 0 AND plot_rating <= 5),
    CONSTRAINT setting_rating_check CHECK (setting_rating >= 0 AND setting_rating <= 5),
    CONSTRAINT style_rating_check CHECK (style_rating >= 0 AND style_rating <= 5)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.book_reviews
    OWNER to permalist_k8so_user;

CREATE OR REPLACE TRIGGER set_updated_at
    BEFORE UPDATE 
    ON public.book_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER trigger_update_final_rating
    AFTER INSERT OR UPDATE 
    ON public.book_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_final_rating();

CREATE TABLE authorized_users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    profile_picture TEXT,
    author BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO authorized_users (google_id, email)
VALUES ('google-id', 'akash22164033@akgec.ac.in');

CREATE TABLE readers (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_updated_at
BEFORE UPDATE ON reader_views
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE to_be_read (
    id SERIAL PRIMARY KEY,           
    title VARCHAR(255) NOT NULL,     
    author VARCHAR(255) NOT NULL,   
    type VARCHAR(100) NOT NULL,      
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,    
    ip_address INET NOT NULL,        
    book_review_id INTEGER NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_book_review FOREIGN KEY (book_review_id) 
    REFERENCES book_reviews (id) ON DELETE CASCADE
);


CREATE TABLE anticipated_books (
    id SERIAL PRIMARY KEY,               
    title VARCHAR(255) NOT NULL,         
    author VARCHAR(255) NOT NULL,         
    release_date DATE NOT NULL,           
    cdn_link TEXT NOT NULL,               
    emoji VARCHAR(10),                    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_updated_at
BEFORE UPDATE ON anticipated_books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();