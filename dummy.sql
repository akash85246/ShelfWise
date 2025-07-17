
-- Insert dummy users
INSERT INTO authorized_users (
    google_id, email, full_name, profile_picture, author, slug, quote, created_at, updated_at
) VALUES
(
        '9558867f-5ba9-4faf-ba02-4204f7c1bd87', 'ysullivan@yahoo.com', 'Norma Fisher', 'https://picsum.photos/seed/user1/200/200',
        true, 'norma-fisher', 'Measure example sense peace economy.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '3458a748-e9bb-47bc-a3f2-c9bf9c6316b9', 'corey15@castro-gomez.com', 'Victoria Patrick', 'https://picsum.photos/seed/user2/200/200',
        true, 'victoria-patrick', 'Local tend employee source nature add rest.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '38c1962e-9148-424f-aac1-c14f30e9c5cc', 'vclayton@cross.com', 'Roger Barnett', 'https://picsum.photos/seed/user3/200/200',
        true, 'roger-barnett', 'Sound central myself before year.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '9a6a5f92-cca7-4147-b6be-1f723405095c', 'jasmine85@hotmail.com', 'Yolanda Burns', 'https://picsum.photos/seed/user4/200/200',
        true, 'yolanda-burns', 'Onto knowledge other his offer face country.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '148b2758-d7ab-4928-89e4-69e6ec62b2c8', 'daviskatherine@gmail.com', 'Lonnie Douglas', 'https://picsum.photos/seed/user5/200/200',
        true, 'lonnie-douglas', 'Raise study modern miss dog Democrat quickly.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        'd8570102-55d4-4936-a151-5607964a870c', 'christopher91@yahoo.com', 'Jennifer Hill', 'https://picsum.photos/seed/user6/200/200',
        true, 'jennifer-hill', 'Drug rule bring determine some.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '1ea45cd6-9371-471f-9480-865f9b38fe80', 'brandonberry@guzman.com', 'Robert Garcia', 'https://picsum.photos/seed/user7/200/200',
        true, 'robert-garcia', 'Before street break painting create wife.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '0fa07a3f-2e29-4065-afa2-31e959acdd98', 'stephenschristine@jones-jones.com', 'Karen Acosta', 'https://picsum.photos/seed/user8/200/200',
        true, 'karen-acosta', 'Level others record hospital employee toward like.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        'aa6524ab-713b-4e05-abe2-136898c75205', 'kramereric@peterson.com', 'Laura Wolfe', 'https://picsum.photos/seed/user9/200/200',
        true, 'laura-wolfe', 'Actually race tonight themselves.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '0bb2c3f0-bd30-491a-95fe-a08e143e2e04', 'annsmith@hotmail.com', 'Mariah Price', 'https://picsum.photos/seed/user10/200/200',
        true, 'mariah-price', 'Exactly drive well good explain grow water.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '559b5975-b2d6-40af-b13b-32b798363189', 'fpoole@gmail.com', 'Lisa Baldwin', 'https://picsum.photos/seed/user11/200/200',
        true, 'lisa-baldwin', 'Dream PM her then.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        'e28bc9ff-870f-484c-b244-f536285e25b4', 'martincaleb@hotmail.com', 'Jennifer Morales', 'https://picsum.photos/seed/user12/200/200',
        true, 'jennifer-morales', 'Traditional page a although for study anyone.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '8741ae91-acfe-4b4b-929e-8693faf1501b', 'valeriemorales@butler.com', 'Valerie Perry', 'https://picsum.photos/seed/user13/200/200',
        true, 'valerie-perry', 'Best budget power them evidence without beyond take.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '58d87776-a51a-44f3-a699-bae0d138d150', 'callahandennis@hotmail.com', 'Brad Hill', 'https://picsum.photos/seed/user14/200/200',
        true, 'brad-hill', 'The everything affect American.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '2371ea2c-0247-445f-8a81-4d53964ddb77', 'djoseph@graham.biz', 'Kristin Potts', 'https://picsum.photos/seed/user15/200/200',
        true, 'kristin-potts', 'Even front happen behavior.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '85e69ea9-db66-4fda-adf9-67474ed13553', 'michael82@wilson-cross.com', 'Amanda Nelson', 'https://picsum.photos/seed/user16/200/200',
        true, 'amanda-nelson', 'Few structure federal board.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        'bc18a40b-55c7-4d9d-8d49-85dc09aedbd0', 'mendozaholly@yahoo.com', 'Karen Rogers', 'https://picsum.photos/seed/user17/200/200',
        true, 'karen-rogers', 'Turn phone heart window.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        '6c4c3935-379d-4da1-ade6-c5e9b6e355f6', 'cruzcorey@stone.org', 'Andrea Miller', 'https://picsum.photos/seed/user18/200/200',
        true, 'andrea-miller', 'Happy write end since.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        'f2ad985f-ff3e-4ba1-8ac7-28b4a41865bf', 'mgoodwin@crawford.com', 'Ian Brown', 'https://picsum.photos/seed/user19/200/200',
        true, 'ian-brown', 'Perhaps bit learn gun still.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
(
        'd5627386-528c-4241-a345-ac72eac39204', 'frich@hotmail.com', 'Kyle Freeman', 'https://picsum.photos/seed/user20/200/200',
        true, 'kyle-freeman', 'Your play themselves myself use act relationship.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    );


-- Insert dummy book reviews
INSERT INTO public.book_reviews (
    user_id, title, slug, status, author, review, quote, moment,
    favorite_character, least_favorite_character, ending, genre, format,
    created_at, updated_at, views, moment_page_number, cover_url, isbn, publisher, published_year
) VALUES
(
        13, 'Stand along chance either six', 'stand-along-chance-either-six-1', 'published', 'Lauren Robbins',
        'Son might trip at. American address such former. Song than leave he. Too maybe off question source serious. Section town deal movement. Individual win suddenly win parent do ten after.', 'Scientist few now.', 'Assume teacher wall field impact special.', 'Bryan', 'Danielle',
        'Expert stop area along individual.', 'Thriller', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        265, 262, 'https://picsum.photos/seed/book1/200/300', '9783161609532', 'Wu-Guzman', 2015
    ),
(
        17, 'Purpose character would', 'purpose-character-would-2', 'published', 'Logan Hughes',
        'Likely character allow pay. Food record power crime situation since book art. Pass value practice wide require fast support.', 'Son true their race special million.', 'Although hot he couple ground.', 'Crystal', 'Sue',
        'Effort ago mind notice then director simply.', 'Romance', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        143, 387, 'https://picsum.photos/seed/book2/200/300', '9783161199437', 'Chan, Hale and Fisher', 2006
    ),
(
        3, 'Watch certainly through instead', 'watch-certainly-through-instead-3', 'published', 'Brian Brown',
        'Safe air land rather. Market ten foot. Bad audience grow ahead girl. Store discover hand. Throw debate daughter purpose voice but according hard.', 'Usually do center.', 'Both general where candidate whom gun list.', 'Kelly', 'Sharon',
        'Contain year bill ok choose today. Source firm drug senior.', 'Fantasy', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        573, 52, 'https://picsum.photos/seed/book3/200/300', '9783161470977', 'Watson-Alvarado', 2017
    ),
(
        15, 'Over hour reduce', 'over-hour-reduce-4', 'published', 'Edwin Butler',
        'Instead PM be know hard we around impact. While top kid he weight before. Someone everybody newspaper read.', 'Up control instead company where future model.', 'Leg PM low data ability recognize.', 'Christine', 'Alan',
        'Shoulder pick nation choose.', 'Non-fiction', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        63, 281, 'https://picsum.photos/seed/book4/200/300', '9783161114723', 'Potter, Davis and Jimenez', 1995
    ),
(
        8, 'Myself if place again', 'myself-if-place-again-5', 'published', 'Michael Smith',
        'Three report know second government the pull. Other along society figure future. Teacher three seven attention team executive care. Phone most improve play idea sing small. Kind nothing case but building.', 'Opportunity cause property government line indeed.', 'Major maybe manage when know central many.', 'Paige', 'Jason',
        'Hospital year suffer without rather bank we. According American per yourself their record.', 'Fantasy', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        891, 33, 'https://picsum.photos/seed/book5/200/300', '9783161300348', 'Lester, Taylor and Berry', 2004
    ),
(
        3, 'Black leave form collection', 'black-leave-form-collection-6', 'published', 'Steven Graham',
        'Model can travel know. Interview man role somebody keep daughter. Town almost plan. Hair sea quality do. Partner relate mention expect there.', 'In approach recent program possible natural.', 'Ok majority region democratic entire analysis.', 'Francisco', 'Adam',
        'As into develop part.', 'Fantasy', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        955, 251, 'https://picsum.photos/seed/book6/200/300', '9783161214355', 'Morse, Chavez and Morgan', 2009
    ),
(
        18, 'Paper beat five', 'paper-beat-five-7', 'published', 'Stephanie Scott',
        'Couple bag thank. Could cut pull save fine team. Lot the drive figure necessary. Leave right answer. Without leave brother bank better she. This degree partner stand next though.', 'Always Congress majority campaign that various.', 'Yes blue tonight particular smile represent.', 'Kimberly', 'Willie',
        'Plant evening admit past Republican common increase. Expect save process score middle.', 'Romance', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        560, 301, 'https://picsum.photos/seed/book7/200/300', '9783161401630', 'Martinez Ltd', 2018
    ),
(
        8, 'Brother say grow push', 'brother-say-grow-push-8', 'published', 'Mary Walker',
        'Million push do pick. Old case administration measure happen. Speech theory choice. Member baby share sit.', 'Notice receive degree run staff service government.', 'Car material truth pattern ago other majority final.', 'Susan', 'Angela',
        'Speak say national region bad case I.', 'Fantasy', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        193, 96, 'https://picsum.photos/seed/book8/200/300', '9783161134574', 'Underwood LLC', 2006
    ),
(
        2, 'Want decade firm section economic', 'want-decade-firm-section-economic-9', 'published', 'Mary Keller',
        'General class admit of around. Character against physical agency and difficult president at. General professional career two. Itself group computer forget would section him.', 'Through move source wonder relate service.', 'Tv important hope about catch than method.', 'Jessica', 'Eddie',
        'Style star east against southern. Sea stuff no response.', 'Fiction', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        945, 277, 'https://picsum.photos/seed/book9/200/300', '9783161816700', 'Pennington-Harper', 2015
    ),
(
        19, 'Pick report past always future scene', 'pick-report-past-always-future-scene-10', 'published', 'Mario Preston',
        'Group public leader medical. Save identify establish manage. Address morning explain light alone mother. Energy rather lay return identify many again. Effect quite reflect. Yet seven several might history.', 'Decade not forget why under.', 'Purpose mouth then class test check suffer star.', 'Brenda', 'Brett',
        'Guy personal follow situation over would.', 'Thriller', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        281, 231, 'https://picsum.photos/seed/book10/200/300', '9783161616586', 'Kramer PLC', 2012
    ),
(
        19, 'Kind game act', 'kind-game-act-11', 'published', 'Susan Beck',
        'Could nature interest wear community college probably church. Walk place myself his. Entire expect investment yard responsibility watch. Money fish garden relationship it center accept.', 'Choice produce type none guess we no.', 'Pm sometimes set tonight gun word.', 'Eric', 'James',
        'Record affect same number drug continue serve information. Large season last meeting southern relate when.', 'Fantasy', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        248, 9, 'https://picsum.photos/seed/book11/200/300', '9783161867022', 'Alexander Inc', 2007
    ),
(
        14, 'Play wait education think similar', 'play-wait-education-think-similar-12', 'published', 'Ann Johnson',
        'Dark huge itself play pull. Old great notice. Report foreign agency list miss among not.', 'Guess attorney response provide likely fire.', 'Fire town worker.', 'Kathy', 'Joshua',
        'Challenge term memory clear throughout treat relate respond.', 'Fiction', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        801, 75, 'https://picsum.photos/seed/book12/200/300', '9783161996870', 'Williams, Colon and Williams', 2004
    ),
(
        1, 'Reality recently hold conference son spend', 'reality-recently-hold-conference-son-spend-13', 'published', 'Christopher Baker',
        'Red effect else very your choice. Need although one political almost serious stand. Cover social particularly speech. City four pretty live new myself star.', 'Able simple billion parent now from.', 'Mention would technology budget first age.', 'Jessica', 'Andrew',
        'Analysis population recognize someone treatment. Should represent group strong back approach great top.', 'Fiction', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        193, 311, 'https://picsum.photos/seed/book13/200/300', '9783161970408', 'Chambers-Hart', 1997
    ),
(
        20, 'Include air sort couple hold', 'include-air-sort-couple-hold-14', 'published', 'Caleb Bell',
        'Pattern president add lead network the. Live teach movie I situation understand agree. Believe step four western likely almost training. Source where a front war receive civil single.', 'Policy drug these person.', 'Lot thousand question.', 'Bradley', 'John',
        'Color draw difficult there leg theory.', 'Fiction', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        984, 95, 'https://picsum.photos/seed/book14/200/300', '9783161852996', 'Hughes Inc', 1997
    ),
(
        14, 'Us accept hope soon', 'us-accept-hope-soon-15', 'published', 'Mrs. Samantha Hicks MD',
        'Particularly sing purpose here ago job trial. Represent two hair describe hundred candidate. Probably whom it job likely different house.', 'However ok structure your those head against.', 'Single theory everybody particularly test hospital personal move.', 'Melissa', 'Douglas',
        'Should room with. Under require page claim future in.', 'Non-fiction', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        855, 134, 'https://picsum.photos/seed/book15/200/300', '9783161173404', 'Sellers, Hancock and Gill', 2004
    ),
(
        2, 'Value generation pick', 'value-generation-pick-16', 'published', 'Lorraine Molina',
        'Computer on fast play fact. Alone improve heart decade care book. Close issue huge away represent race. Nation network college debate direction moment.', 'Ground think save respond friend budget while.', 'Significant energy citizen physical why mouth.', 'Duane', 'Nicholas',
        'Doctor trip her hope likely. Who yet spend raise child.', 'Non-fiction', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        40, 306, 'https://picsum.photos/seed/book16/200/300', '9783161205823', 'Silva Ltd', 2015
    ),
(
        6, 'Blood single recently other owner message', 'blood-single-recently-other-owner-message-17', 'published', 'Nicholas Jackson',
        'Action throughout stage. Five put hard recent project speech director. No still back task.', 'Ago poor coach year.', 'Part decade remain if again care.', 'Paul', 'Nicole',
        'Trouble upon beautiful. If do them although per environmental medical nearly.', 'Romance', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        807, 347, 'https://picsum.photos/seed/book17/200/300', '9783161265893', 'Kennedy-White', 2000
    ),
(
        15, 'Hair few participant true lead while', 'hair-few-participant-true-lead-while-18', 'published', 'Keith Ortiz',
        'Lot sport father growth behind. Statement carry next according. Next sense make real use nice.', 'Their rate drop marriage worker ever.', 'Many water meeting.', 'Matthew', 'Chris',
        'Difficult happen high serve discuss very. Process sit executive partner story budget great.', 'Romance', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        482, 349, 'https://picsum.photos/seed/book18/200/300', '9783161529816', 'Perez-Fletcher', 2022
    ),
(
        18, 'Trouble it grow husband short year term', 'trouble-it-grow-husband-short-year-term-19', 'published', 'Eddie Griffin',
        'Sea upon full director race. Let left very your stock determine. Maybe main fire range begin first. Star issue any side image. Customer force both something hair.', 'Well account movement can start.', 'Various current scientist culture ability to suffer at.', 'Gregory', 'Jimmy',
        'Listen a decision wish among west. Old region still.', 'Fiction', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        759, 41, 'https://picsum.photos/seed/book19/200/300', '9783161452234', 'Gibson, Taylor and Holmes', 1992
    ),
(
        12, 'War resource evening realize', 'war-resource-evening-realize-20', 'published', 'Mary Gray',
        'Cut meet build black treat buy. Like lawyer fund indicate help north friend. Law go simple improve language. Need when simple. Involve education little direction exist. Outside upon why mission because feel military.', 'Watch choice already thank.', 'She light question in.', 'James', 'Peter',
        'Could foreign mind myself surface old charge. Management production up our allow maintain page fish.', 'Non-fiction', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        689, 184, 'https://picsum.photos/seed/book20/200/300', '9783161718951', 'Gonzalez, Williams and Anderson', 1998
    ),
(
        20, 'Them particular produce board whole', 'them-particular-produce-board-whole-21', 'published', 'Tammy Walters',
        'Management court head successful response hospital. Suffer life chair senior seem west. Week remain decide happy another image. Take one them in.', 'Plant whether protect most trade.', 'Herself Mr bad wide manage.', 'Alexis', 'Robert',
        'Base age speak pass tend. Tell mention check election order everything stuff detail.', 'Romance', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        342, 82, 'https://picsum.photos/seed/book21/200/300', '9783161351045', 'Reese-Pennington', 2004
    ),
(
        13, 'Station enough become choice', 'station-enough-become-choice-22', 'published', 'Kristy Brown',
        'Itself history the bring parent very card. Those budget involve all. Enough break factor pattern PM. My full need claim many against television. Case yet between night western serious. Now minute technology only magazine.', 'Subject development best student describe concern professional.', 'Human participant seat give especially.', 'Teresa', 'Michael',
        'Democratic stock worker everybody professor. Bar standard final.', 'Non-fiction', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        790, 340, 'https://picsum.photos/seed/book22/200/300', '9783161843446', 'Casey, Morris and Miller', 1992
    ),
(
        15, 'Factor boy Republican', 'factor-boy-republican-23', 'published', 'Kayla Reed',
        'Increase mother important ball. You company drop join recognize all structure. Away wish finish within president. Any remain support realize cause. Argue home exactly different week treat mouth threat.', 'Interest college anything relationship.', 'Himself draw final station tough whether address.', 'Karen', 'Alicia',
        'East example identify likely view around remember.', 'Non-fiction', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        929, 288, 'https://picsum.photos/seed/book23/200/300', '9783161733316', 'Howard, Wright and Walker', 1990
    ),
(
        2, 'Small control work name', 'small-control-work-name-24', 'published', 'Sean Bowen',
        'Serve can street race seat. Would federal test some score reveal so. Artist cold measure defense mouth. Billion talk mouth tonight throw action section.', 'Second late every include generation.', 'Election baby seven only scientist teach.', 'Kathleen', 'Brian',
        'Eat report to product outside they eye.', 'Thriller', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        561, 325, 'https://picsum.photos/seed/book24/200/300', '9783161187521', 'Hernandez, Estrada and Richardson', 1998
    ),
(
        7, 'Maybe read card look', 'maybe-read-card-look-25', 'published', 'Sandra Gonzalez',
        'List key little fast speak tree. Table owner how husband time fear. Successful country describe method meeting space military. Sing media step live game item lay. Appear role why learn attention cut billion.', 'Without wall stay describe time.', 'Community whole growth speech across yard admit parent.', 'Sarah', 'Marie',
        'Hotel matter guy great old.', 'Fiction', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        772, 2, 'https://picsum.photos/seed/book25/200/300', '9783161962696', 'Lyons and Sons', 2023
    ),
(
        7, 'Order evening scene', 'order-evening-scene-26', 'published', 'Janet Flores',
        'Probably particularly measure only wait technology town. Job page position. Maybe information forward trouble. Country article will firm woman section magazine loss.', 'Especially position learn senior today mention.', 'Resource part instead city type short rather.', 'Lisa', 'Kim',
        'Significant stuff section lot rather beyond share energy.', 'Fantasy', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        705, 94, 'https://picsum.photos/seed/book26/200/300', '9783161205047', 'Reid PLC', 2020
    ),
(
        4, 'Soon account part wind well thousand', 'soon-account-part-wind-well-thousand-27', 'published', 'Richard Olson',
        'Place cell reflect popular see different. Include try agree out human. Room father identify within street national sea.', 'There certainly walk camera debate western store.', 'Light environmental deep range ten television model.', 'Kimberly', 'Nancy',
        'Significant strategy medical voice.', 'Fantasy', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        669, 267, 'https://picsum.photos/seed/book27/200/300', '9783161956973', 'Ashley Inc', 2012
    ),
(
        2, 'Study form seem beat debate', 'study-form-seem-beat-debate-28', 'published', 'Michael Ruiz',
        'Ball keep since my. International available despite popular stock memory challenge. Century alone popular break. Modern north good program. I spring season toward level generation since. Rise sit hand.', 'According off little happy short during agency.', 'Born American grow wall conference especially low.', 'Robin', 'Stacey',
        'Pressure local rise general sort.', 'Romance', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        265, 286, 'https://picsum.photos/seed/book28/200/300', '9783161430000', 'Martin, Williams and Rodgers', 2013
    ),
(
        14, 'Probably up strategy receive rate oil', 'probably-up-strategy-receive-rate-oil-29', 'published', 'Alexander Gibson',
        'Stay provide particularly firm foreign involve show ten. Mention hot happy far. Effort drop onto until head. Draw front plan focus century service nearly. Relate others throw land daughter consider group. Report become market decision hope.', 'Dark such firm again court culture story.', 'Learn economy explain main sport summer sea.', 'Holly', 'Heidi',
        'Throughout free civil entire.', 'Fantasy', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        182, 107, 'https://picsum.photos/seed/book29/200/300', '9783161493823', 'Hansen, Parker and Nolan', 2008
    ),
(
        11, 'Heart watch bed bag wind physical', 'heart-watch-bed-bag-wind-physical-30', 'published', 'Alicia Keller',
        'Western stage yes too dog among. Statement role before open. Report sign office until particularly when. Everyone city contain week carry. Election small certainly pattern daughter. Together professional wind consider.', 'Admit Mrs look call spring establish together record.', 'Social say about century debate.', 'Barbara', 'Aaron',
        'Machine American five detail.', 'Fantasy', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        95, 174, 'https://picsum.photos/seed/book30/200/300', '9783161917277', 'Bryant Ltd', 1992
    ),
(
        10, 'Discuss power safe push country', 'discuss-power-safe-push-country-31', 'published', 'Dillon Ryan',
        'Experience hotel compare box operation. Might catch that trip. Institution to movie seven. School enter wind heavy.', 'General television save.', 'Near sign Republican notice prevent figure.', 'Scott', 'Kathleen',
        'Light hot because movement business. See collection cut drive out image thought.', 'Fantasy', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        561, 67, 'https://picsum.photos/seed/book31/200/300', '9783161407659', 'Lewis, Gonzalez and Vasquez', 1997
    ),
(
        17, 'Under between candidate crime', 'under-between-candidate-crime-32', 'published', 'Margaret Reynolds',
        'Pull likely piece small go. Reduce alone culture democratic radio. Century law before. Structure face forget result professor. Theory become buy many partner.', 'Discover carry TV drive.', 'Machine century suddenly.', 'Mitchell', 'Erica',
        'Focus raise away tough subject customer far.', 'Fiction', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        412, 169, 'https://picsum.photos/seed/book32/200/300', '9783161413760', 'Coleman, Swanson and Gray', 2016
    ),
(
        11, 'Central baby picture', 'central-baby-picture-33', 'published', 'Cole Guzman',
        'One then investment scientist. Walk cause trouble movie. Stuff federal like be. Positive better management minute air represent. Beat start say either none heavy down business.', 'Way sister civil market value during difficult religious.', 'Ten will summer specific.', 'Brittany', 'Gregory',
        'Believe performance officer election information.', 'Fantasy', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        490, 60, 'https://picsum.photos/seed/book33/200/300', '9783161833578', 'Erickson and Sons', 2021
    ),
(
        6, 'Around four PM hospital against', 'around-four-pm-hospital-against-34', 'published', 'David Parsons',
        'Easy mission laugh wind. She inside mind. Represent resource pretty write. Fear knowledge player down positive. Be certain ago whom language. Since experience perform interest particularly notice military civil.', 'Environment style remain.', 'Machine likely middle car market.', 'Stephanie', 'George',
        'Fund remain team body all.', 'Non-fiction', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        825, 328, 'https://picsum.photos/seed/book34/200/300', '9783161191144', 'Morris-Le', 1994
    ),
(
        1, 'Form single camera political', 'form-single-camera-political-35', 'published', 'Philip Barr',
        'Reach government support improve. Black because song capital administration sound teach hit. Down PM benefit arm subject over feeling. Buy protect front why ability fund front. Drug thing number end commercial.', 'Hundred billion blue right fine boy sing.', 'Bill pattern scientist early.', 'Mary', 'Gabriella',
        'Close election stop cold. Agree her whether beyond bar shoulder decade.', 'Fiction', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        569, 266, 'https://picsum.photos/seed/book35/200/300', '9783161403899', 'Reyes, Ford and Wheeler', 2018
    ),
(
        12, 'Student cost policy across inside water', 'student-cost-policy-across-inside-water-36', 'published', 'Gregory Edwards',
        'Thing responsibility education evening clearly these tonight. Poor head perform walk expert easy. Learn military top cup. Week own necessary allow including level. Happy culture daughter make capital because. Really wait if everything bad age local. School able pattern story term show.', 'Large message exist word beat her.', 'Herself population seven sign executive will.', 'Angela', 'Courtney',
        'Child push it why research wind yard.', 'Romance', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        599, 398, 'https://picsum.photos/seed/book36/200/300', '9783161274672', 'Bowen, Turner and Kelley', 2017
    ),
(
        17, 'Industry trial position college', 'industry-trial-position-college-37', 'published', 'Jeffrey Alexander',
        'Wrong discuss agency fund consumer. Theory simply concern page director writer act. Would truth join issue face key when.', 'City citizen to.', 'List run safe figure.', 'Peter', 'Brenda',
        'Set attack she represent family us.', 'Thriller', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        206, 61, 'https://picsum.photos/seed/book37/200/300', '9783161621233', 'Schultz-Kelley', 2015
    ),
(
        5, 'Help attention American some', 'help-attention-american-some-38', 'published', 'Adam Parker',
        'Person choose order. Like ball cause way. Career big remember parent produce cut beyond.', 'Item boy response knowledge may thousand music.', 'Talk role instead candidate.', 'Courtney', 'Susan',
        'Behind social her he trip. Recognize national training drug really check if.', 'Fiction', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        469, 194, 'https://picsum.photos/seed/book38/200/300', '9783161479209', 'Moss-Dunlap', 2024
    ),
(
        19, 'Health account central scientist realize present', 'health-account-central-scientist-realize-present-39', 'published', 'Brian Burns',
        'Every end catch American. Spend food world believe soldier certain. Fly play pay real good. Show whatever simple wrong newspaper allow. Discuss almost serious Mr sing city. Another wonder reveal yet possible.', 'Similar entire pretty.', 'Effect unit state plant.', 'George', 'James',
        'Order impact spend question election air parent forget. Doctor nature cup whom poor send.', 'Thriller', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        696, 217, 'https://picsum.photos/seed/book39/200/300', '9783161646547', 'Gibson PLC', 2021
    ),
(
        20, 'Or which white get bring', 'or-which-white-get-bring-40', 'published', 'Jennifer Lopez',
        'Top his outside project us pass management serious. Child investment yourself still. Education red citizen notice feeling. Better child computer either.', 'Fly rock make build painting either.', 'Heart message matter position water.', 'James', 'Joseph',
        'Whole increase beat. Republican agent manage special way.', 'Romance', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        348, 362, 'https://picsum.photos/seed/book40/200/300', '9783161883327', 'Dunn-Warren', 2010
    ),
(
        20, 'Season region little continue onto agent', 'season-region-little-continue-onto-agent-41', 'published', 'Eric Jones',
        'Small law campaign value. Suffer team word major western education. Remember rich yeah simple guess member.', 'Spend practice organization fill can cause.', 'Value create agree likely.', 'Ashley', 'Brent',
        'None none ball ground candidate life have. Billion beyond quality fill final oil.', 'Romance', 'Hardcover', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        596, 151, 'https://picsum.photos/seed/book41/200/300', '9783161853015', 'Townsend Ltd', 2020
    ),
(
        8, 'If plan before talk want it', 'if-plan-before-talk-want-it-42', 'published', 'James Patterson II',
        'Side environment speak let guy son last early. Wish relate sound market best only know. Company produce clear various production your. Her serve finally task. Country power police.', 'Summer city when bag.', 'Time to black her become less production.', 'Jasmine', 'Brian',
        'Place strong parent behind.', 'Romance', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        307, 8, 'https://picsum.photos/seed/book42/200/300', '9783161895762', 'Ray Inc', 2018
    ),
(
        17, 'Table tonight suddenly idea', 'table-tonight-suddenly-idea-43', 'published', 'Jesse Adams',
        'Company speak end time trouble stay beat PM. Put lay too strong forward interesting. Learn argue glass matter upon. Call share its guess. Building care door natural produce.', 'Operation point loss mean production establish.', 'Adult range true even matter.', 'Jenna', 'Daniel',
        'Body lay work no. National probably thank fish somebody dinner former.', 'Thriller', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        514, 18, 'https://picsum.photos/seed/book43/200/300', '9783161701748', 'Thomas-Bowen', 1995
    ),
(
        10, 'Wish loss cause', 'wish-loss-cause-44', 'published', 'Samuel Phelps',
        'Fly find create artist. Serve rule thus. Western worry week people worker time.', 'Hot always say notice though.', 'Increase simple as.', 'Daisy', 'Sarah',
        'Third since laugh model make. Might fight social forward provide.', 'Non-fiction', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        427, 247, 'https://picsum.photos/seed/book44/200/300', '9783161986562', 'Braun-Campos', 2014
    ),
(
        6, 'Degree training level', 'degree-training-level-45', 'published', 'Jeffrey Singh',
        'Local week color wait. Back use me media onto. Product building view its.', 'Break voice middle reflect.', 'Smile reveal third option.', 'Dylan', 'Jason',
        'Between heavy by of mission parent. Now owner believe industry yeah see country response.', 'Fantasy', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        583, 131, 'https://picsum.photos/seed/book45/200/300', '9783161448846', 'Middleton LLC', 1994
    ),
(
        13, 'Society foot knowledge report', 'society-foot-knowledge-report-46', 'published', 'Nicole Foster',
        'Gas this sort unit operation. Assume part father himself research general. Within night want according.', 'Personal task same yourself front season suddenly really.', 'Standard even exist identify agency toward.', 'Lisa', 'David',
        'Fear choose song according foot choice.', 'Fiction', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        656, 66, 'https://picsum.photos/seed/book46/200/300', '9783161350559', 'Evans and Sons', 2008
    ),
(
        5, 'Southern church inside series tell thank', 'southern-church-inside-series-tell-thank-47', 'published', 'Maria Taylor',
        'Car usually growth opportunity spend behavior. Dark wrong response suddenly. Agree tax form great education. See we find knowledge treatment development serious. Address star role yard son speech Democrat.', 'Give song computer respond current wife budget.', 'Child speech represent performance cold if.', 'Elizabeth', 'Rebecca',
        'Unit in baby notice.', 'Thriller', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        734, 42, 'https://picsum.photos/seed/book47/200/300', '9783161806261', 'Jones, Nguyen and Chavez', 1999
    ),
(
        13, 'Respond some significant specific city paper', 'respond-some-significant-specific-city-paper-48', 'published', 'Shelly Kim',
        'Mr management admit any could. Senior current fact scientist nothing change suffer. This per pretty. Society oil activity include audience white step.', 'Star feel chance although address politics.', 'Across do issue let spend compare.', 'Ashley', 'Amanda',
        'Something camera himself.', 'Thriller', 'Paperback', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        103, 242, 'https://picsum.photos/seed/book48/200/300', '9783161915947', 'Gross Ltd', 1999
    ),
(
        11, 'Blue tend house staff commercial herself', 'blue-tend-house-staff-commercial-herself-49', 'published', 'Lorraine Stone',
        'Other question indeed message picture study. Full road nothing defense customer. Serious form fight century office. Every war something book notice society. Class here develop seven can place this. Try poor modern democratic human difference.', 'Music check close agreement.', 'Capital white yet people.', 'Hector', 'Robert',
        'Case middle resource project establish indicate.', 'Fiction', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        562, 333, 'https://picsum.photos/seed/book49/200/300', '9783161463507', 'Walton PLC', 2002
    ),
(
        15, 'Cover program reason environmental', 'cover-program-reason-environmental-50', 'published', 'Edward Forbes',
        'Expect true discussion without current rate. Movement edge collection which. Agree move analysis its body source.', 'Memory say together bit wish.', 'Good challenge business rule sometimes serve community.', 'Rachel', 'John',
        'Ready back song group environmental foreign threat billion. Less physical media artist.', 'Non-fiction', 'Ebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        956, 173, 'https://picsum.photos/seed/book50/200/300', '9783161782069', 'Morales-Olson', 1997
    );


-- Insert dummy ratings for each review
INSERT INTO public.book_review_ratings (
    review_id, title, rating
) VALUES
(1, 'Plot', 3),
(1, 'Characters', 4),
(1, 'Writing Style', 3),
(1, 'Originality', 5),
(1, 'Pacing', 2),
(2, 'Plot', 5),
(2, 'Characters', 5),
(2, 'Writing Style', 2),
(2, 'Originality', 3),
(2, 'Pacing', 1),
(3, 'Plot', 3),
(3, 'Characters', 5),
(3, 'Writing Style', 2),
(3, 'Originality', 5),
(3, 'Pacing', 4),
(4, 'Plot', 4),
(4, 'Characters', 1),
(4, 'Writing Style', 5),
(4, 'Originality', 4),
(4, 'Pacing', 3),
(5, 'Plot', 2),
(5, 'Characters', 2),
(5, 'Writing Style', 5),
(5, 'Originality', 4),
(5, 'Pacing', 1),
(6, 'Plot', 5),
(6, 'Characters', 3),
(6, 'Writing Style', 1),
(6, 'Originality', 5),
(6, 'Pacing', 3),
(7, 'Plot', 1),
(7, 'Characters', 5),
(7, 'Writing Style', 4),
(7, 'Originality', 3),
(7, 'Pacing', 5),
(8, 'Plot', 4),
(8, 'Characters', 1),
(8, 'Writing Style', 1),
(8, 'Originality', 2),
(8, 'Pacing', 2),
(9, 'Plot', 5),
(9, 'Characters', 3),
(9, 'Writing Style', 5),
(9, 'Originality', 2),
(9, 'Pacing', 2),
(10, 'Plot', 1),
(10, 'Characters', 3),
(10, 'Writing Style', 5),
(10, 'Originality', 1),
(10, 'Pacing', 4),
(11, 'Plot', 1),
(11, 'Characters', 2),
(11, 'Writing Style', 3),
(11, 'Originality', 2),
(11, 'Pacing', 3),
(12, 'Plot', 1),
(12, 'Characters', 5),
(12, 'Writing Style', 5),
(12, 'Originality', 5),
(12, 'Pacing', 1),
(13, 'Plot', 4),
(13, 'Characters', 1),
(13, 'Writing Style', 3),
(13, 'Originality', 1),
(13, 'Pacing', 1),
(14, 'Plot', 4),
(14, 'Characters', 2),
(14, 'Writing Style', 1),
(14, 'Originality', 1),
(14, 'Pacing', 5),
(15, 'Plot', 1),
(15, 'Characters', 3),
(15, 'Writing Style', 3),
(15, 'Originality', 4),
(15, 'Pacing', 2),
(16, 'Plot', 2),
(16, 'Characters', 3),
(16, 'Writing Style', 3),
(16, 'Originality', 4),
(16, 'Pacing', 5),
(17, 'Plot', 3),
(17, 'Characters', 5),
(17, 'Writing Style', 3),
(17, 'Originality', 1),
(17, 'Pacing', 5),
(18, 'Plot', 3),
(18, 'Characters', 3),
(18, 'Writing Style', 4),
(18, 'Originality', 3),
(18, 'Pacing', 2),
(19, 'Plot', 5),
(19, 'Characters', 3),
(19, 'Writing Style', 2),
(19, 'Originality', 2),
(19, 'Pacing', 4),
(20, 'Plot', 3),
(20, 'Characters', 4),
(20, 'Writing Style', 4),
(20, 'Originality', 1),
(20, 'Pacing', 1),
(21, 'Plot', 4),
(21, 'Characters', 4),
(21, 'Writing Style', 5),
(21, 'Originality', 4),
(21, 'Pacing', 1),
(22, 'Plot', 2),
(22, 'Characters', 4),
(22, 'Writing Style', 1),
(22, 'Originality', 3),
(22, 'Pacing', 2),
(23, 'Plot', 1),
(23, 'Characters', 4),
(23, 'Writing Style', 3),
(23, 'Originality', 3),
(23, 'Pacing', 4),
(24, 'Plot', 1),
(24, 'Characters', 4),
(24, 'Writing Style', 4),
(24, 'Originality', 3),
(24, 'Pacing', 1),
(25, 'Plot', 5),
(25, 'Characters', 1),
(25, 'Writing Style', 2),
(25, 'Originality', 1),
(25, 'Pacing', 5),
(26, 'Plot', 4),
(26, 'Characters', 1),
(26, 'Writing Style', 1),
(26, 'Originality', 3),
(26, 'Pacing', 4),
(27, 'Plot', 1),
(27, 'Characters', 2),
(27, 'Writing Style', 3),
(27, 'Originality', 1),
(27, 'Pacing', 1),
(28, 'Plot', 5),
(28, 'Characters', 1),
(28, 'Writing Style', 5),
(28, 'Originality', 4),
(28, 'Pacing', 4),
(29, 'Plot', 1),
(29, 'Characters', 2),
(29, 'Writing Style', 2),
(29, 'Originality', 3),
(29, 'Pacing', 3),
(30, 'Plot', 1),
(30, 'Characters', 3),
(30, 'Writing Style', 2),
(30, 'Originality', 2),
(30, 'Pacing', 5),
(31, 'Plot', 4),
(31, 'Characters', 2),
(31, 'Writing Style', 1),
(31, 'Originality', 3),
(31, 'Pacing', 2),
(32, 'Plot', 1),
(32, 'Characters', 1),
(32, 'Writing Style', 5),
(32, 'Originality', 4),
(32, 'Pacing', 4),
(33, 'Plot', 4),
(33, 'Characters', 1),
(33, 'Writing Style', 3),
(33, 'Originality', 3),
(33, 'Pacing', 2),
(34, 'Plot', 1),
(34, 'Characters', 2),
(34, 'Writing Style', 2),
(34, 'Originality', 1),
(34, 'Pacing', 4),
(35, 'Plot', 4),
(35, 'Characters', 5),
(35, 'Writing Style', 2),
(35, 'Originality', 4),
(35, 'Pacing', 1),
(36, 'Plot', 2),
(36, 'Characters', 3),
(36, 'Writing Style', 1),
(36, 'Originality', 1),
(36, 'Pacing', 1),
(37, 'Plot', 3),
(37, 'Characters', 2),
(37, 'Writing Style', 1),
(37, 'Originality', 2),
(37, 'Pacing', 5),
(38, 'Plot', 2),
(38, 'Characters', 1),
(38, 'Writing Style', 5),
(38, 'Originality', 4),
(38, 'Pacing', 2),
(39, 'Plot', 3),
(39, 'Characters', 4),
(39, 'Writing Style', 4),
(39, 'Originality', 2),
(39, 'Pacing', 5),
(40, 'Plot', 3),
(40, 'Characters', 1),
(40, 'Writing Style', 5),
(40, 'Originality', 2),
(40, 'Pacing', 3),
(41, 'Plot', 1),
(41, 'Characters', 1),
(41, 'Writing Style', 5),
(41, 'Originality', 1),
(41, 'Pacing', 1),
(42, 'Plot', 3),
(42, 'Characters', 2),
(42, 'Writing Style', 2),
(42, 'Originality', 4),
(42, 'Pacing', 3),
(43, 'Plot', 5),
(43, 'Characters', 5),
(43, 'Writing Style', 1),
(43, 'Originality', 4),
(43, 'Pacing', 2),
(44, 'Plot', 5),
(44, 'Characters', 5),
(44, 'Writing Style', 2),
(44, 'Originality', 1),
(44, 'Pacing', 1),
(45, 'Plot', 4),
(45, 'Characters', 3),
(45, 'Writing Style', 3),
(45, 'Originality', 4),
(45, 'Pacing', 4),
(46, 'Plot', 3),
(46, 'Characters', 1),
(46, 'Writing Style', 1),
(46, 'Originality', 4),
(46, 'Pacing', 4),
(47, 'Plot', 3),
(47, 'Characters', 4),
(47, 'Writing Style', 1),
(47, 'Originality', 5),
(47, 'Pacing', 4),
(48, 'Plot', 1),
(48, 'Characters', 1),
(48, 'Writing Style', 5),
(48, 'Originality', 5),
(48, 'Pacing', 2),
(49, 'Plot', 4),
(49, 'Characters', 4),
(49, 'Writing Style', 1),
(49, 'Originality', 1),
(49, 'Pacing', 5),
(50, 'Plot', 5),
(50, 'Characters', 3),
(50, 'Writing Style', 2),
(50, 'Originality', 4),
(50, 'Pacing', 3);
