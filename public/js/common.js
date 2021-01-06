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
    $.post("/api/posts",data,(postData,status,xhr)=>{
        var html=createPostHtml(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled",true);

    })
})

function createPostHtml(postData){

    var postedBy=postData.postedBy;
    var displayName=postedBy.FirstName+" "+postedBy.LastName;
    var timeStamp="to do later"
    return `<div class="post">
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
                            <div class="postButtonContainer">
                                <button>
                                    <i class="fas fa-retweet"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer">
                                <button>
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
}   