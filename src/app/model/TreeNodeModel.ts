
export class TreeNodeModel {
  private _name = "";
  private _children: TreeNodeModel[] = [];
  private _parent: TreeNodeModel;

  constructor(name, parent=undefined) {
    this._name = name;
    this._parent = parent
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get children(): TreeNodeModel[] {
    return this._children;
  }

  set children(value: TreeNodeModel[]) {
    this._children = value;
  }


  get parent(): TreeNodeModel {
    return this._parent;
  }

  set parent(value: TreeNodeModel) {
    this._parent = value;
  }

  /**
   * Function that appends tree node to the list of children
   * @param node object of the child
   */
  addToChildren(node: TreeNodeModel) {
    if(this.validateCyclicConsistency(node.name)){
      this._children.push(node);
    } else {
      throw "Cyclic error";
    }
  }
/**
 * Function that ensures cyclic consistancy of the new child inserts
 * @param childName name of the child to be inserted 
 */
  validateCyclicConsistency(childName): boolean{
    if(this.name != childName){
      if(this.parent){
        return this.parent.validateCyclicConsistency(childName);
      }
      return true;
    }
    return false;
  }
/**
 * Functions that replaces last element of the children with the parameter of the child
 * @param child object to replace the last child
 */
  replaceLastChild(child:TreeNodeModel){
    this.children[this.children.length-1] = child;
  }

}
