Changes required for release:



For me:

manifest.json
	"start_url": "/cleancab/index.html",
	"scope": "/cleancab/",
	
index.html	
  navigator.serviceWorker.register('serviceworker.js', {scope: '/cleancab/'})	
  
serviceworker.js
    - all url needs /cleancab/
  
  
  
For Scott

manifest.json
	"start_url": "/index.html",
	"scope": "/",

index.html	
  navigator.serviceWorker.register('serviceworker.js', {scope: '/'})	
	
serviceworker.js
    - change /ceancab/ back to just /