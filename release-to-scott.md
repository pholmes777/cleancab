Changes required for release:



For me:

manifest.json
	"start_url": "/cleancab/index.html",
	"scope": "/cleancab/",
	
index.html	
  navigator.serviceWorker.register('serviceworker.js', {scope: '/cleancab/'})	
  
  
  
For Scott

manifest.json
	"start_url": "/index.html",
	"scope": "/",

index.html	
  navigator.serviceWorker.register('serviceworker.js', {scope: '/'})	
	