if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
  npm install && npm run dev
else
  cp -r ../weighttracker.zz50.co.uk/dist .
  sleep infinity
fi
