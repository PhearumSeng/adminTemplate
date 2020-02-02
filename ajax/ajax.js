$(function(){
    fetchArticles()
    //get value from input
    $('#searchArticle').on('keyup', function(){
        //console.log($('#searchArticle').val())
        searchArticle($('#searchArticle').val())
    })
    $('#callModal').on('click', function(){
        $('#modalArticle').modal('show') //popup madal when btn clicked
        $('#modalTitle').text('Add')
        $('#ids').val('')
        $('#title').val('')
        $('#desc').val('')
      $('#imgurl').val('')

    })
    $('#save').on('click', function(){
        // console.log($('#title').val());
        let aritcle = {
            TITLE: $('#title').val(),
            DESCRIPTION: $('#desc').val(),
            IMAGE: $('#imgurl').val()
        }
        if($('#modalTitle').text() == "Add"){
            addArticle(aritcle)
        }else{
            udateArticle(aritcle, $('#aid').val())
        }
        
    })
})

function fetchArticles(){
    $.ajax({
        url: 'http://110.74.194.124:15011/v1/api/articles?page=1&limit=15',
        // url: 'https://jsonplaceholder.typicode.com/photos',
        method: 'GET',
        success: function(art){
            appendTable(art.DATA)
            // appendTable(art)
            // console.log(art)
        },
        error: function(err){
            console.log(err)
        }

    })
}


function appendTable(articles) {
    let content = ''
    for (a of articles) {
        content += `
        <tr>
        <th scope="row">${a.ID}</th>
        <td>${a.TITLE}</td>
        <td>${a.DESCRIPTION}</td>
        <td>${formatDate(a.CREATED_DATE)}</td>
        <td><img src=${a.IMAGE}></td>
        <td><button class="btn btn-secondary" data-dismiss="modal" onclick ='goToDetail(${a.ID})'>View</button><td> 
        <td><button class="btn btn-secondary" data-dismiss="modal" onclick ='editArticle(this)' data-id=${a.ID}>Edit</button><td> 
        <td><button class="btn btn-secondary" data-dismiss="modal" onclick ='deleteArticle(${a.ID})'>Delete</button><td>   
        </tr>
        `
    }
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = content
}

function formatDate(createDate){
    let year = createDate.substring(0, 4)   //<td>${formatDate(a.CREATED_DATE)}</td>
    let month= createDate.substring(4, 6)
    let day = createDate.substring(6, 8)
    // let date = [year, month, day]
    let date = [day, month, year]
    return date.join('/')
}
// function urlsub(suburl){
//         // let http = suburl.substring(0, 12)
//         // let num = suburl.substring(27, 38)
//         let addr = suburl.substring(12, 27)
//         return addr
// }
function goToDetail(idd){
    // window.location.href = `detail.html?id =${id}`
   console.log(`${idd.TITLE}`)
  Swal.fire({
    title: `${idd.TITLE}`,
    text: 'Modal with a custom image.',
    imageUrl: `<img src=${idd.IMAGE}>` ,          //'https://unsplash.it/400/200'
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Custom image',
  })
      
}
function deleteArticle(articleId){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `http://110.74.194.124:15011/v1/api/articles/${articleId}`,
                method: 'delete',
                success: function(res){
                    fetchArticles()
                },
                error: function(err){
                    console.log(err)
                }
            })
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
}
function addArticle(article){
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles`,
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ="
        },
        data: JSON.stringify(article),
        success: function(res){
            // console.log(res)
            fetchArticles()
            $('#modalArticle').modal('hide')
        },
        error: function(er){
            console.log(er)
        }
    })
}
function searchArticle(title){
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles?title=${title}&page=1&limit=15`,
        method: 'get',
        success: function(res){
            appendTable(res.DATA)
        },
        error: function(er){
            console.log(er)
        }
    })
}
function editArticle(btnEdit){
    //call modal
    $('#modalArticle').modal('show')
    $('#modalTitle').text('Edit')
    //get value to set in input
    let id = $(btnEdit).parent().siblings().eq(0).text()
    //console.log(id)
    let title = $(btnEdit).parent().siblings().eq(1).text()
    let desc = $(btnEdit).parent().siblings().eq(2).text()
    let imageUrl = $(btnEdit).parent().siblings().eq(4).find('img').attr('src')
    //console.log(imageUrl)
    $('#ids').val(id)
    $('#title').val(title)
    $('#desc').val(desc)
  $('#imgurl').val(imageUrl)
  $('#aid').val($(btnEdit).attr('data-id'))
}
function udateArticle(article, id){
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles/${id}`,
        method: 'put',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ="
        },
        data: JSON.stringify(article),
        success: function(res){
            // console.log(res)
            fetchArticles()
            $('#modalArticle').modal('hide')
        },
        error: function(er){
            console.log(er)
        }
    })
}