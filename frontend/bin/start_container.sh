if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
  npm install && npm run dev
else
  cd /opt/weighttracker_frontend_public/ && cp -r ../weighttracker.zz50.co.uk/dist .
  sleep infinity
fi
