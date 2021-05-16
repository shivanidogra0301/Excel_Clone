

let container = document.querySelector(".data-container")

function columnname(n){
    
    let str = ""
        while (n > 0) {
            let rem = n % 26;
            if (rem == 0) {
                str = "Z" + str;
                n = Math.floor(n / 26) - 1;
            } else {
                str = String.fromCharCode((rem - 1) + 65) + str;
                n = Math.floor(n / 26);
            }
        }
        
    return str
}

let celldata = {
    "Sheet1" :{}
}
let selectedsheet = "Sheet1";
let lastlyaddedsheet = 1
let totalsheets = 1;
let defaultprop = {
    "text" : "",
    "font-family" : "Noto Sans",
    "font-size" : 14,
    "bold" : false,
    "italic" : false,
    "underline" : false,
    "alignment" : "left",
    "color" :"",
    "bgcolor" :""
}





for(let i = 0; i <= 100; i++){
    
    for(let j = 0; j <= 100; j++){

        let dv = document.createElement("div");

        if(i == 0 && j == 0){
            dv.innerText="";
            dv.classList.add("selection-cell")
            
        }
        else if(j == 0){
            dv.innerText = i;
            dv.classList.add("row-name-cell")

            
        }
        else if(i == 0){
            dv.innerText= columnname(j);
            dv.classList.add("col-name-cell")

        }
        else{
            dv.setAttribute("contenteditable","false");
            dv.setAttribute("class","input-cell");
        }
        
        dv.classList.add("cell")
        
        dv.setAttribute("col",j);
        dv.setAttribute("row",i);

        container.appendChild(dv);
    }
    
}
$(`.input-cell[row = 1][col = 1]`).addClass("selected first-cell-selected");

$(".input-cell").dblclick(function(e){
    $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    $(this).addClass("selected");
    
    $(this).attr("contenteditable","true");
    $(this).focus();
    

})

$(".input-cell").blur(function(e){
    updateCellData("text", $(this).text());
    $(this).attr("contenteditable","false");
    
})

function getRowcol(ele){
    let row = $(ele).attr("row");
    let col = $(ele).attr("col");
    return [Number.parseInt(row),Number.parseInt(col)]; 
}

function getTopLeftRightBottom(rowid,colid){
    let topcell = $(`.input-cell[row = ${rowid-1}][col = ${colid}]`)
    let bottomcell = $(`.input-cell[row = ${rowid+1}][col = ${colid}]`)
    let leftcell = $(`.input-cell[row = ${rowid}][col = ${colid-1}]`)
    let rightcell = $(`.input-cell[row = ${rowid}][col = ${colid+1}]`)
    return [topcell,bottomcell,leftcell,rightcell];

}

$(".input-cell").click(function(e){
    $(".input-cell.selected").attr("contenteditable","false");
    

    let [rowid,colid] = getRowcol(this)
    // console.log(rowid+" "+colid);
    let [topcell,bottomcell,leftcell,rightcell] = getTopLeftRightBottom(rowid,colid);

    if($(this).hasClass("selected") && e.ctrlKey) {
        unselectCell(this,e,topcell,bottomcell,leftcell,rightcell);

    } else {
        selectedCell(this,e,topcell,bottomcell,leftcell,rightcell);
    }
})

function unselectCell(ele,e,topCell,bottomCell,leftCell,rightCell) {
    if($(ele).attr("contenteditable") == "false") {
        if($(ele).hasClass("top-selected")) {
            topCell.removeClass("bottom-selected");
        }
    
        if($(ele).hasClass("bottom-selected")) {
            bottomCell.removeClass("top-selected");
        }
    
        if($(ele).hasClass("left-selected")) {
            leftCell.removeClass("right-selected");
        }
    
        if($(ele).hasClass("right-selected")) {
            rightCell.removeClass("left-selected");
        }
    
        $(ele).removeClass("selected top-selected bottom-selected left-selected right-selected");

}
}

let count = 0;
function selectedCell(ele,e,topcell,bottomcell,leftcell,rightcell){
    
    if(e.ctrlKey){
        //to check top cell is selected or not

        let topselected; 
        if(topcell){
            topselected = topcell.hasClass("selected");
        }

        let bottomselected; 
        if(bottomcell){
            bottomselected = bottomcell.hasClass("selected");
        }

        let leftselected; 
        if(leftcell){
            leftselected = leftcell.hasClass("selected");
        }

        let rightselected; 
        if(rightcell){
            rightselected = rightcell.hasClass("selected");
        }

        if(topselected){
            $(ele).addClass("top-selected")
            topcell.addClass("bottom-selected")
        }

        if(bottomselected){
            $(ele).addClass("bottom-selected")
            bottomcell.addClass("top-selected")
        }

        if(leftselected){
            $(ele).addClass("left-selected ")
            leftcell.addClass("right-selected")
        }

        if(rightselected){
            $(ele).addClass("right-selected ")
            rightcell.addClass("left-selected")
        }
    }
    else{
        $(".input-cell.selected").removeClass("selected top-selected left-selected right-selected bottom-selected first-cell-selected")
        count = 0;
    }
    if(count == 0){
        $(ele).addClass("first-cell-selected");
    }
    count++;
    $(ele).addClass("selected");
    
    changeHeader(getRowcol(ele))
}
function changeHeader([rowid,colid]){
    
    let data;
    if(celldata[selectedsheet][rowid-1]!=undefined && celldata[selectedsheet][rowid-1][colid -1] != undefined){
         data = celldata[selectedsheet][rowid-1][colid -1];

    }
    else{
        
        data = defaultprop;
    }
    
    
    $(".alignment.selected").removeClass("selected");
    $(`.alignment[data-type=${data.alignment}]`).addClass("selected");
    toggleInIconsStyle(data,"bold")
    toggleInIconsStyle(data,"italic")
    toggleInIconsStyle(data,"underline")
    $("#font-family").val(data["font-family"]);
    $("#font-family").css("font-family",data["font-family"]);

    $("#font-size").val(data["font-size"]);

}

function toggleInIconsStyle(data,property){
    if(data[property]) {
        $(`#${property}`).addClass("selected");
    } else {
        $(`#${property}`).removeClass("selected");
    }
}

let startcell = {};
let endcell = {}
let scrollXRStarted = false;
$(".input-cell").mousedown(function(e){
    e.preventDefault()
    if(e.buttons == 1){
        
           let [rowid,colid] = getRowcol(this);
            startcell = {rowId : rowid,colId:colid};
        }
    
});

$(".input-cell").mouseenter(function(e){
    if(e.buttons == 1){
        let [rowid,colid] = getRowcol(this);
        endcell = {rowId : rowid,colId:colid};
        selectAllBetweenCells(startcell,endcell);
    }
})

function selectAllBetweenCells(start,end){
    $(".input-cell.selected").removeClass("selected top-selected left-selected right-selected bottom-selected")
    let rs = Math.min(start.rowId, end.rowId);
    let re = Math.max(start.rowId,end.rowId);
    let cs = Math.min(start.colId,end.colId);
    let ce = Math.max(start.colId,end.colId);
    for(let i = rs; i <= re; i++){
        for( let j = cs; j <= ce; j++){
        let [topcell,bottomcell,leftcell,rightcell] = getTopLeftRightBottom(i,j);
            selectedCell($(`.input-cell[row = ${i}][col = ${j}]`)[0],{"ctrlKey" : true},topcell,bottomcell,leftcell,rightcell)
        }
    }
}

$(".alignment").click(function(e){
    let align = $(this).attr("data-type");
    $(".alignment.selected").removeClass("selected");
    $(this).addClass("selected")
    $(".input-cell.selected").css("text-align",align);
    // $(".input-cell.selected").each(function(idx,data){
    //     let [rowId,colId] = getRowcol(data);
    //     celldata[rowId-1][colId-1].alignment = align;
    // })
    updateCellData("alignment",align);

})

$('#bold').click(function(e){
    setStyle(this,"bold","font-weight","bold")
})

$('#italic').click(function(e){
    setStyle(this,"italic","font-style","italic")
})

$('#underline').click(function(e){
    setStyle(this,"underline","text-decoration","underline")
})

function setStyle(ele,property,key,value){
    if($(ele).hasClass("selected")){
        $(ele).removeClass("selected");
        $(".input-cell.selected").css(key,"");
        $(".input-cell.selected").each(function(index,data){
            // let [rowid,colid] = getRowcol(data);
            // celldata[rowid-1][colid-1][property] = false;
            updateCellData(property,false);
        })
    }

    else{
        $(ele).addClass("selected");
        $(".input-cell.selected").css(key,value);
        $(".input-cell.selected").each(function(index,data){
            // let [rowid,colid] = getRowcol(data);

            // celldata[rowid-1][colid-1][property] = true;
            updateCellData(property,true);

        })
    }
}

const pickr = Pickr.create({
    el: '.format-color',
    theme: 'monolith', // or 'monolith', or 'nano'

    swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
    ],

    components: {

        // Main components
        preview: true,
        opacity: true,
        hue: true,
    }
});

const pickr2 = Pickr.create({
    el: '.format-color-text',
    theme: 'monolith', // or 'monolith', or 'nano'

    swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
    ],

    components: {

        // Main components
        preview: true,
        opacity: true,
        hue: true,
    }
});



$(".menu-selector").change(function(e){
    let value = $(this).val();
    let key = $(this).attr("id");
    if(key == 'font-family'){
        $("#font-family").css(key,value);
    }
    if(!isNaN(value)){
        value = parseInt(value);
    }

    $(".input-cell.selected").css(key,value);
    $(".input-cell.selected").each(function(idx,data){
        // let [rowid,colid] = getRowcol(data);
        // celldata[rowid-1][colid-1][key] = value;
        updateCellData(key,value);
    })
})


function updateCellData(property,value) {
    
    if (value != defaultprop[property]) {
        $(".input-cell.selected").each(function (index, data) {
            let [rowId, colId] = getRowcol(data);
            if (celldata[selectedsheet][rowId - 1] == undefined) {
                celldata[selectedsheet][rowId - 1] = {};
                celldata[selectedsheet][rowId - 1][colId - 1] = { ...defaultprop };
                celldata[selectedsheet][rowId - 1][colId - 1][property] = value;
            } else {
                if (celldata[selectedsheet][rowId - 1][colId - 1] == undefined) {
                    celldata[selectedsheet][rowId - 1][colId - 1] = { ...defaultprop };
                    celldata[selectedsheet][rowId - 1][colId - 1][property] = value;
                } else {
                    celldata[selectedsheet][rowId - 1][colId - 1][property] = value;
                }
            }

        });
    } else {
        $(".input-cell.selected").each(function (index, data) {
            let [rowId, colId] = getRowcol(data);
            if (celldata[selectedsheet][rowId - 1] != undefined &&celldata[selectedsheet][rowId - 1][colId - 1] != undefined) {
                celldata[selectedsheet][rowId - 1][colId - 1][property] = value;
                if (JSON.stringify(celldata[selectedsheet][rowId - 1][colId - 1]) == JSON.stringify(defaultprop)) {
                    delete celldata[selectedsheet][rowId - 1][colId - 1];
                }
            }
        });
    }
}
$(".container").click(function(e){
    $('.sheet-options-modal').remove();

})

function addSheetEvents(){
    $(".sheet-tab.selected").on("contextmenu",function(e){
        e.preventDefault();
        selectSheet(this);

        
        $('.sheet-options-modal').remove();
        let modal = $(`<div class="sheet-options-modal">
        <div class="option sheet-rename">Rename</div>
        <div class="option sheet-delete">Delete</div>
    
    </div>`);
    modal.css({"left" : e.pageX});
    $(".container").append(modal);
    $(".sheet-rename").click(function(e){
        let renameModal = $(`<div class="sheet-modal-parent">
        <div class="sheet-rename-modal">
            <div class="sheet-modal-title">Rename Sheet</div>
            <div class= "sheet-modal-input-container">
                <span class="sheet-modal-input-title">Rename Sheet to:</span>
                <input type="text" class="sheet-modal-input">
            </div>
            <div class="sheet-modal-confirmation">
                <div class="button yes-button">OK</div>
                <div class="button no-button">Cancel</div>

            </div>
        </div>
    </div>`)

    $(".container").append(renameModal);
     $(".no-button").click(function(e){
        $(".sheet-modal-parent").remove();
        })
    $(".yes-button").click(function(e){
        
        renameSheet();
    })
    $(".sheet-modal-input").keypress(function(e){
        if(e.key == "Enter"){
            renameSheet();
        }
    })
    })
    $(".sheet-delete").click(function(e){
        if(totalsheets > 1){
            let deleteModal = $(`<div class="sheet-modal-parent">
            <div class="sheet-delete-modal">
                <div class="sheet-modal-title">Sheet Name</div>
                <div class= "sheet-modal-detail-container">
                    <span class="sheet-modal-detail-title">Are you sure?</span>
                    
                </div>
                <div class="sheet-modal-confirmation">
                    <div class="button yes-button">Delete</div>
                    <div class="button no-button">Cancel</div>
    
                </div>
            </div>
        </div>
    </div>`)
            $(".container").append(deleteModal);
            $(".no-button").click(function(e){
                $(".sheet-modal-parent").remove();
            })

            $(".yes-button").click(function(){
                deletesheet();
            })
            
        }
        else{
            alert("error");
        }
       
    })
    
    })

    $(".sheet-tab.selected").click(function(e){
        
            selectSheet(this);
    })


}
addSheetEvents();



$(".add-sheet").click(function(e){
    lastlyaddedsheet++;
    totalsheets++;
    celldata[`Sheet${lastlyaddedsheet}`] = {};
    $(".sheet-tab.selected").removeClass("selected")
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">Sheet${lastlyaddedsheet}</div>`);
    selectSheet();
    addSheetEvents();
})



function selectSheet(ele){
    if(ele && !$(ele).hasClass("selected")){
        $(".sheet-tab.selected").removeClass("selected");
        $(ele).addClass("selected");
    }
    emptyPrevSheets();
    selectedsheet = $(".sheet-tab.selected").text();
    loadCurrentSheet();
    $(`.input-cell[row = 1][col = 1]`).click();

    
}
function emptyPrevSheets(){
    let data = celldata[selectedsheet];
    let rowkeys = Object.keys(data);
    for(let i of rowkeys){
        let rowid = parseInt(i);
        let colkeys = Object.keys(data[rowid]);
        
        for(let j of colkeys){
            let colid = parseInt(j);
            let cell = $(`.input-cell[row = ${rowid+1}][col = ${colid+1}]`);
            cell.text("");
            cell.css({
                "font-family" : "NotoSans",
                "font-size"  : 14,
                "background-color" : "#fff",
                "color" : "#444",
                "font-weight" :"",
                "font-style" :"",
                "text-decoration" :"",
                "text-align" :"left"
            })
        } 
    }
}

function loadCurrentSheet(){
   
    let data = celldata[selectedsheet];
    let rowkeys = Object.keys(data);
    for(let i of rowkeys){
        let rowid = parseInt(i);
        let colkeys = Object.keys(data[rowid]);
        
        for(let j of colkeys){
            let colid = parseInt(j);
            let cell = $(`.input-cell[row = ${rowid+1}][col = ${colid+1}]`);
            cell.text(data[rowid][colid]["text"]);
            cell.css({
                "font-family" : data[rowid][colid]["font-family"],
                "font-size"  : data[rowid][colid]["font-size"],
                "background-color" : data[rowid][colid]["background-color"],
                "color" : data[rowid][colid]["color"],
                "font-weight" :data[rowid][colid].bold?"bold":"",
                "font-style" :data[rowid][colid].italic?"italic":"",
                "text-decoration" :data[rowid][colid].underline?"underline":"",
                "text-align" :data[rowid][colid].alignment
            })
        } 
    }
}
function renameSheet(){
    let newSheetName = $(".sheet-modal-input").val();
    if(newSheetName && !Object.keys(celldata).includes(newSheetName)){
        let newcelldata = {};
        for(let i of Object.keys(celldata)){
            if(i == selectedsheet){
                newcelldata[newSheetName] = celldata[selectedsheet]
            }
            else{
                newcelldata[i] = celldata[i];
            }
        }
        celldata = newcelldata;
        
        selectedsheet = newSheetName;
        $(".sheet-tab.selected").text(newSheetName);
        $(".sheet-modal-parent").remove()
    }
    else{
        $(".rename-error").remove();
        $(".sheet-modal-input-container").append(`<div class= "rename-error">Sheet name is empty or already exists </div>`)
    }



}

function deletesheet(){
    $(".sheet-modal-parent").remove();
    let sheetindex = Object.keys(celldata).indexOf(selectedsheet);
    let curselectsheet = $(".sheet-tab.selected");
    if(sheetindex == 0){
        selectSheet(curselectsheet.next()[0])
        
    }
    else{
        selectSheet(curselectsheet.prev()[0])
        
    }
    delete celldata[curselectsheet.text()]
    curselectsheet.remove();
    totalsheets--;
}




