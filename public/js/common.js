
$("#postTextarea").keyup(function(event){
    var textbox=$(event.target);
    var value = textbox.val().trim();
    var submitButton=$("#submitPostButton");
    if(submitButton.length==0) return alert("Button not found");
    if(value==""){
        submitButton.prop("disabled", true);
        return
    }
    submitButton.prop("disabled", false);

})

$("#submitPostButton").click(function(){
    var button = $(event.target);
    var textbox =$("#postTextarea");

    var data={
        content:textbox.val()
    }

    // data is the json sent to the server
    // postData is the data sent by the server
    $.post("/api/posts",data,(postData)=>{
        var html=createPostHtml(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled",true);

    }) 
})

function createPostHtml(postData){

    var postedBy=postData.postedBy;
    if(postedBy._id==undefined){
        return console.log("User object not populated");
    }
    var displayName=postedBy.FirstName+" "+postedBy.LastName;
    var timeStamp=timeDifference(new Date(),new Date(postData.createdAt));
    var likeButtonActiveClass=postData.likes.includes(userLoggedIn._id)?"active":"";
    return `<div class="post" data-id='${postData._id}'>
                <div class="mainContentContainer">
                    <div class="userImageContainer">
                        <img src="${postedBy.profilePic}">
                    </div>
                    <div class="postContentContainer">
                        <div class="header">
                            <a href='/profile/${postedBy.UserName}' class="displayName">${displayName}</a>
                            <span class="username">@${postedBy.UserName}</span>
                            <span class="date">${timeStamp}</span>    
                        </div>
                        <div class="postBody">
                            <span>${postData.content}</span>
                        </div>
                        <div class="postFooter">
                            <div class="postButtonContainer">
                                <button>
                                    <i class="far fa-comment"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer green">
                                <button class="retweet">
                                    <i class="fas fa-retweet"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer red">
                                <button class="likeButton ${likeButtonActiveClass}">
                                    <i class="far fa-heart"></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
}   


$(document).on('click',".likeButton",(event)=>{
    var button = $(event.target);
    var postId=getPostIdFromElement(button);
    console.log(postId)
    if(postId==undefined)return ;
    $.ajax({
        type:"PUT",
        url:`/api/posts/${postId}/like`,
        success: function (postData){
            button.find("span").text(postData.likes.length || "")

            if(postData.likes.includes(userLoggedIn._id)){
                button.addClass("active");
            }
            else button.removeClass("active");
        }
    })
})

function getPostIdFromElement(element){
    var isRoot=element.hasClass('post')
    var rootElement = isRoot ? element:element.closest('.post');
    var postId=rootElement.data().id;
    if(postId==undefined)return console.log("Post id undefined");
    return postId;
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        let seconds=Math.round(elapsed/1000)
        if(seconds<30){
            return "Just Now";
        }
        return seconds+' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}