# To allow chrome to trust localhost, browse to 
#
#    chrome://flags/#unsafely-treat-insecure-origin-as-secure
#
# and add the following:
#
#    http://0.0.0.0:8000/
#

#npx http-server docs --port 8080 --silent -o  2> /dev/null &
cd docs
python3 -m http.server  2> /dev/null &

