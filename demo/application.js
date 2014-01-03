$(function(){

	$('html').on('click','a[href="#"]',function(e){
		e.preventDefault();
	});
	$('.demo1').autocomplete({
		url:'data.php',
		containerSelectorClass:'list-group',
		itemSelectorClass:'list-group-item',
		containerElementName:'div',
        itemElementName:'a',     
        selectedClass:'active',
        renderResultItem:function(item,parentObject){
        	parentObject.attr('href','#');
        	return  item;
        }
	});
	$('.demo2').autocomplete({
		url:'data.php',
		containerSelectorClass:'list-group',
		itemSelectorClass:'list-group-item',
		containerElementName:'div',
        selectedClass:'active',
        renderResultItem:function(item,parentObject){
        	parentObject.attr('href','#');
        	return  item;

        },
        onEnter:function(selectedObject,options,event){
        	event.preventDefault();
        	if(selectedObject !== null){
        		options.inputBox.val(selectedObject.text());
        	}
        	options.inputBox.closest('form').submit();
        }
	});

	$('.demo3').autocomplete({
		url:'data2.php',
		containerSelectorClass:'custom-autocomplete',
        itemSelectorClass:'item',
        containerElementName:'ul',
        itemElementName:'li',
        showMoreButton:true,
        showMoreButtonUrl:'#moreResults-{{keyword}}', 
        renderResultItem:function(item,parentObject){
        	html = '';
        	html+='<img src="'+item.image+'"/>';
        	html+='<div class="title_content">';
        	html+='<a href="profile.php?id'+item.id+'">'+item.title+'</a>';
        	html+='<p>'+item.content+'</p>';
        	html+="</div>"
        	return  html;
        },
        onEnter:function(selectedObject,options,event){
        	event.preventDefault();
        	if(selectedObject !== null){
        		options.inputBox.val(selectedObject.find('a').text());
        	}
        	options.inputBox.closest('form').submit();
        },
        onMouseSelect:function(selectedObject,options,event){
        	options.onEnter(selectedObject,options,event);
        }
	});
});