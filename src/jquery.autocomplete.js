/* ========================================================================
 * Autocomplete by solaiman kmail (psokmail@gmail.com) 
 * http://psokmail.com
 * https://github.com/skmail/autocomplete
 * ======================================================================== */
(function($) {
    $.fn.autocomplete = function(options) {
        var options = $.extend(true,{},{
            url:null,
            ajaxRequestMethod:'get',
            dataSource:null,
            startOnChar:3,
            containerMainSelectorClass:'autocomplete-results',
            containerElementName:'ul',
            itemElementName:'li',            
            containerSelectorClass:null,
            itemSelectorClass:null,
            selectedClass:null,
            renderResultItem:$.fn.autocomplete.renderResultItem,
            onMouseSelect:$.fn.autocomplete.onMouseSelect,
            onEnter:$.fn.autocomplete.onEnter,
            showMoreButton:false,
            showMoreButtonLabel:'Show More Results',
            showMoreButtonUrl:'#{{keyword}}'
        },options);
        return this.each(function(){
            options.inputBox = $(this);
            options.inputBox.keydown(function(event){
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode == 13){
                    resultsContainer = $(this).next('.'+options.containerMainSelectorClass);
                    if($(resultsContainer).size() > 0 ){
                        selectedObject = $(resultsContainer).find(' > .selected');
                    }
                    if(selectedObject.length == 0){
                        selectedObject = null;
                    }
                    options.onEnter(selectedObject,options,event);
                }
            });

            options.inputBox.keyup(function(event){
                var keycode = (event.keyCode ? event.keyCode : event.which);
                var resultsContainer = $(this).next('.'+options.containerMainSelectorClass);
                if(keycode == 40 || keycode == 38 ){
                    // 40 Keydown
                    // 38 Keyup
                    if(keycode == 40){
                        $.fn.autocomplete.show(options);
                    }

                    if($(resultsContainer).size() > 0 ){
                        if($(resultsContainer).find(' > ' + options.itemElementName + '.selected').size() > 0){
                            currentSelectedItem = $(resultsContainer).find(' > ' + options.itemElementName + '.selected');
                            $.fn.autocomplete.removeSelected($(resultsContainer).find(' > ' + options.itemElementName + '.selected'),options);
                            if(keycode == 40 ){
                                if((options.showMoreButton == true &&  currentSelectedItem.next().hasClass('show-more-button'))){
                                    currentSelectedItem = $(resultsContainer).find(' > ' + options.itemElementName ).first();
                                    $.fn.autocomplete.addSelected(currentSelectedItem,options);
                                }else{
                                    $.fn.autocomplete.addSelected(currentSelectedItem.next(),options);
                                }
                            }else if(keycode == 38 ){
                                if(currentSelectedItem.is(':first-child')){
                                    if((options.showMoreButton == true &&  $(resultsContainer).find(' > ' + options.itemElementName ).last().hasClass('show-more-button'))){
                                        currentSelectedItem = $(resultsContainer).find(' > ' + options.itemElementName ).eq(-2);       
                                    }else{
                                        currentSelectedItem = $(resultsContainer).find(' > ' + options.itemElementName ).last();
                                    }
                                    $.fn.autocomplete.addSelected(currentSelectedItem,options);
                                }else{
                                    $.fn.autocomplete.addSelected(currentSelectedItem.prev(),options);
                                }
                            }
                        }else{
                            currentSelectedItem = $(resultsContainer).find(' > ' + options.itemElementName ).first();
                            $.fn.autocomplete.addSelected(currentSelectedItem,options);
                        }
                    }
                }
                
                if($(this).val() == $(this).data('current-val')){
                    return;
                }else{
                    $(this).data('current-val',$(this).val());
                }
                $.fn.autocomplete.removeResults(options);
                // Disable autocomplete if the characters insterd less than options.startOnChar
                if($(this).val().length < options.startOnChar){
                    return;
                }
                // disable autocomplete if there is no url provided
                if(options.url == null){
                    return;
                }
                options.keyword = $(this).val();
                $.fn.autocomplete.sendRequest(options);
            });
                $('html').on('mouseenter','.' + options.containerMainSelectorClass + ' > ' + options.itemElementName,function(){
                    if(!$(this).hasClass('show-more-button')){
                        $.fn.autocomplete.addSelected($(this),options);
                    }
                }).on('mouseleave','.' + options.containerMainSelectorClass + ' > ' + options.itemElementName,function(){
                    $.fn.autocomplete.removeSelected($(this),options);
                });
            $('html').click(function(){
                $('.'+options.containerMainSelectorClass).hide();    
            })
            $('html').on('click','.'+options.containerMainSelectorClass,function(e){
                e.stopPropagation();
            });
            $('html').on('click','.'+options.containerMainSelectorClass + ' > ' + options.itemElementName, function(e){
                if(options.showMoreButton == false || (options.showMoreButton == true && !$(this).hasClass('show-more-button'))){
                    options.onMouseSelect($(this),options,e); 
                    options.inputBox.trigger( "keyup");
                }
            });
            options.inputBox.on('click',function(e){
               e.stopPropagation(); 
                $.fn.autocomplete.toggleResultsList(options);
            });
        });
    };
    $.fn.autocomplete.sendRequest = function(options){
        $.ajax({
            url: options.url,
            cache:true,
            data:{keyword:options.keyword},
            type:options.ajaxRequestMethod,
            dataType: 'json',
            success: function(response){
                if(response.length != 0){
                    $.fn.autocomplete.renderResults(response,options);
                }
            },
            error:function(jqXHR, textStatus, errorThrown){}
        });
    }
    $.fn.autocomplete.renderResults = function(dataSource,options){
        template = $('<'+options.containerElementName+' class="'+options.containerMainSelectorClass+'"></'+options.containerElementName+'>').addClass(options.containerSelectorClass);
        $.each(dataSource,function(key,val){
            _itemElement = $('<'+options.itemElementName+'></'+options.itemElementName+'>');
            _itemElement.append(options.renderResultItem(val,_itemElement)).addClass(options.itemSelectorClass);
            template.append(_itemElement);
        });
        if(options.showMoreButton == true){
            showMoreButton = $('<'+options.itemElementName+'></'+options.itemElementName+'>');
            showMoreButton.addClass('show-more-button');
            showMoreButtonUrl = options.showMoreButtonUrl.replace('{{keyword}}',options.keyword);
            showMoreButton.append('<a href="'+showMoreButtonUrl+'">'+options.showMoreButtonLabel+'</a>');
            template.append(showMoreButton);
        }
        template.insertAfter(options.inputBox);
    }
    $.fn.autocomplete.renderResultItem = function(item){
        return  '<a href="">'+item+'</a>';
    }
    $.fn.autocomplete.removeResults = function(options){
        options.inputBox.next('.'+options.containerMainSelectorClass).remove();
    }
    $.fn.autocomplete.onMouseSelect  = function(selectedObject,options,event){
        options.inputBox.val(selectedObject.text());
        $.fn.autocomplete.hide(options);
    }
    $.fn.autocomplete.toggleResultsList = function(options){
        if(!options.inputBox.next('.'+options.containerMainSelectorClass).is(':visible')){
            $.fn.autocomplete.show(options);
        }else{
            $.fn.autocomplete.hide(options);
        }
    }
    $.fn.autocomplete.onEnter = function(selectedObject,options,event){

        if(selectedObject !== null){
            options.inputBox.val(selectedObject.text());
        }
        $.fn.autocomplete.hide(options);
    }
    $.fn.autocomplete.hide = function (options){
        options.inputBox.next('.'+options.containerMainSelectorClass).hide();
    }
    $.fn.autocomplete.show = function (options){
        options.inputBox.next('.'+options.containerMainSelectorClass).show();
    }
    $.fn.autocomplete.addSelected = function(object,options){
        object.addClass('selected');
        object.addClass(options.selectedClass);
    }
    $.fn.autocomplete.removeSelected = function(object,options){
        object.removeClass('selected');
        object.removeClass(options.selectedClass);
    }
}(jQuery));


