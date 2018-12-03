export function postRequest (data:any, url:string) {
    return window.fetch("http://127.0.0.1:4444/calculate/", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then((response)=>{
      return response.json();
    })
}