if [ "$ENVIRONMENT" == "DEVELOPMENT" ] ; then
  npm install && npm run dev
else
  npm install && npm run build-only
  sleep infinity
fi
