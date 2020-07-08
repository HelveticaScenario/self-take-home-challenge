# How to run

you need accounts with mapbox and openweathermap.org

create a `.env.local` file in the root of the repo.
copy the contents of `.env.local.template` into `.env.local` and change the MAPBOX_ACCESS_TOKEN and OPEN_WEATHER_APP_ID to your mapbox token and open weather app id, respectively.

From inside the `.devcontainer` folder, run `docker-compose up`, then run `docker exec -it <container name> bash`, then from inside the container run `yarn && yarn build && yarn start`. Now go to http://localhost:3000
