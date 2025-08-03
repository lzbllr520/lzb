
export  interface Server{
  id:string,
  name:string,
  ip:string
}

export interface Node{
  index:number,
  node_id:string,
  browse_name:string,
  display_name:string,
  node_class:string,
  has_children:boolean,
  browsable:boolean
}