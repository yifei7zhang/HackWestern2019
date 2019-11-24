# HackWestern2019


## Inspiration
We were intriguied by the City of London's Open Data portal and wanted to see what we could do with it. We also wanted to give back to the city, which houses UWO and Hack Western, as well as many of our friends. With The London Bridge, we aim to enable communication between the community and its citizens, highlight the most important points of infrastructure to maintain/build upon, and to ultimately make London citizens feel involved and proud of their city.

## What it does
The London Bridge is a web app aiming to bridge communication between changemakers and passionate residents in the city of London. Citizens can submit requests for the construction/maintenance of public infrastructure, including street lights, bike lanes, traffic lights, and parks. Using our specially designed algorithm, The London Bridge uses a variety of criteria such as public demand, proximity to similar infrastructure, and proximity to critical social services to determine the most important issues to bring to the attention of city employees, so that they may focus their efforts on what the city truly needs.

## How we built it
First and foremost, we consulted City of London booth sponsors, the City of London Open Data portal, colleagues studying urban planning, and the 2019 edition of the London Plan to determine the most important criteria that would be used in our algorithm. We created a simple citizen portal where one can submit requests using PugJS templates. We stored geotagged photos in Google Cloud Storage, and relevant geographical/statistical data in MongoDB Atlas, to be used in our score calculating algorithm. Finally, we used Nodejs to implement our algorithm, calculating scores for certain requests, and sending an email to Ward Councellors upon meeting a threshold score.

## Challenges we ran into
Integrating and picking up a variety of new technologies proved to be a difficult challenge, as we had never used any of these technologies before. We also discussed and revised our algorithm many times throughout the hackathon, in hopes of creating a scoring system that would truly reflect London's needs.

## Accomplishments that we're proud of
We're proud of our team's commitment to our hack's vision and goals, especially when things looked hairy.

## What we learned
We learned more about a variety of the aforementioned web technologies, as well as the struggles of integrating them together.

## What's next for The London Bridge
In the future, we'd hope to:
- Refine and add to our algorithm
- Implement additional request types
- Enhance data visualization and add workflow integration
- Add a web interface for city employees
- Create a user login system and impact tracking

