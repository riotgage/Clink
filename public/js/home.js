$(document).ready(()=>{
    $.get("/api/posts",(data)=>{
        displayPosts(data,$(".postsContainer"));
    })
})

function displayPosts(data,container){
    container.html("");
    console.log(data)
    data.forEach(function(d){
        var html =createPostHtml(d);
        container.append(html);
    })
    if(data.length==0){
        container.append("<span class='noResults'>No Posts Available</span>")
    }
}