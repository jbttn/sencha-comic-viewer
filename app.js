/* Config */
var path = '/mnt/merged/Downloads/'
/* Global */
var curIndex = 0

document.onkeydown = keyPressHandler
function keyPressHandler(e) {
  e = e || window.event;
  ComicViewer.views.sidebar.fireEvent('keypressed', e.keyCode);
}

var App = new Ext.Application({
  name: 'ComicViewer',
  useLoadMask: true,
  launch: function () {

    /* Model */
    Ext.regModel('Data', {
      idProperty: 'path',
      fields: [
        {name: 'label', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'path', type: 'string'},
        {name: 'file', type: 'string'},
        {name: 'type', type: 'string'},
      ]
    });
    ComicViewer.stores.dataStore = new Ext.data.TreeStore({
      model: 'Data',
      sorters: [
      {
        property: 'label',
        direction: 'ASC'
      }
      ],
      proxy: {
        type: 'ajax',
//        url : 'json.php?path=' + path,
        url : 'json.php',
//        url : 'json.php?cur_path=' + path,
        reader: {
          type: 'tree',
          root: 'data'
        }
      },
      autoLoad: true
    });

    /* UI */
    ComicViewer.views.mainToolbar = new Ext.Toolbar({
      id: 'mainToolbar',
      title: 'Comic Viewer'
    });

    ComicViewer.views.mainContainer = new Ext.Panel({
      id: 'mainContainer',
      layout: 'auto',
      scroll: 'both',
      //tpl: '<img src=\'image.php?img={name}&path={path}&sel={file}&w=300&h=300&q=f\' />',
      items: [
        {
          html: '<img src=\'http://www.sencha.com/img/sencha-large.png\' />', // default image
          listeners: {
            afterrender: function(c) {
              //ComicViewer.views.mainContainer.scroller.bounces = false
              var img = c.body.select('img').elements[0]
              var size = ComicViewer.views.mainContainer.getSize()
              img.height = size.height // set the starting image size to panel height
              c.body.select('img').on({
                pinchstart: function(e, t){
                  this.startScale = this.scale;
                },
                pinch: function(e, t){
                  //this.scale = e.scale * this.startScale;
                  //t.style.webkitTransform = 'scale(' + this.scale + ')';
                  if(e.deltaScale > 0) {
                    img.height = img.height + 10
                    img.height = Math.min(img.naturalHeight, img.height); 
                  } else {
                    img.height = img.height - 10
                    img.height = Math.max(size.height, img.height); 
                  }
                  ComicViewer.views.mainContainer.scroller.scrollTo({x: 0, y: 0});
                },
                doubletap: function(e, t){
                  console.info('double tap')
                  img.height == img.naturalHeight ? img.height = size.height : img.height = img.naturalHeight
                  ComicViewer.views.mainContainer.scroller.scrollTo({x: 0, y: 0});
                },
                scope: {
                  scale: 1
                }
              });
            }
          }
        }
      ],
      dockedItems: [ComicViewer.views.mainToolbar]
    });

    ComicViewer.views.sidebar = new Ext.NestedList({
      dock: 'left',
      //title: 'Navigation',
      useTitleAsBackText: false,
      displayField: 'name',
      width: 250,
      store: ComicViewer.stores.dataStore,
      listeners: {
        itemtap: function(list, index, item, e) {
          curIndex = index
          var record = list.getStore().getAt(index).data
          if(record.type == 'dir') {
            console.info('Clicked directory')
            console.info(record)
            path = record.path
          } else if(record.leaf && record.type == 'file') {
            
          } else if(record.leaf && record.type == 'image') {
            console.info('Clicked image')
            console.info(record)
            //console.info('<img src=\'image.php?img=' + record.name + '&path=' + record.path + '&sel=' + record.file + '&w=300&h=300&q=f\' />')
            var img = ComicViewer.views.mainContainer.body.select('img').elements[0]
            img.src = 'image.php?img=' + record.name + '&path=' + record.path + '&sel=' + record.file + '&w=300&h=300&q=f'

            //vars = {name: record.name, path: record.path, file: record.file}
            //ComicViewer.views.mainContainer.update(vars)
          } else {
            console.info('Clicked comic')
            console.info(record)
          }
        },
        afterrender: function(c, index, item, e) {
          this.addEvents('keypressed');
          this.addListener({
            keypressed: function(keycode) {
              console.info('pressed key: ' + keycode)
              var active = this.getActiveItem();
              var node = active.getNode(curIndex);
              //active.scroller.startEventName = ["dragstart", "keypressed"]
              //ComicViewer.views.sidebar.fireEvent('dragstart')
              if(keycode == 38 && curIndex > 0) {
                curIndex--
                active.scroller.scrollTo({x: 0, y: node.offsetTop - node.offsetHeight});
              }
              else if(keycode == 40 && curIndex < active.getNodes().length - 1) {
                curIndex++
                active.scroller.scrollTo({x: 0, y: node.offsetTop + node.offsetHeight});
              }
              this.fireEvent('itemtap', active, curIndex, node, e);
              active.getSelectionModel().select(curIndex, true);
              console.info(node.offsetTop)
            }
          });
        }
      },
      getItemTextTpl: function() {
        return '<tpl if="type === \'image\'"><img src=\'image.php?img={name}&path={path}&sel={file}&w=50&h=50&q=70\' /></tpl> {label}<tpl if="type === \'dir\'">/</tpl>';
      },
      getTitleTextTpl: function() {
        return ''
      }
    });

    ComicViewer.views.viewport = new Ext.Panel({
      fullscreen: true,
      layout: 'card',
      cardAnimation: 'slide',
      items: [ComicViewer.views.mainContainer],
      /*
      items: [{
        html: 'Card 1'
      },{
        html: 'Card 2'
      }],
      */
      /*
      dockedItems: [
        {
          html: 'Left panel?',
          style: 'background-color: #ddd',
          dock: 'left'
        }
      ]
      */
      dockedItems: [ComicViewer.views.sidebar],
    });

  }
})