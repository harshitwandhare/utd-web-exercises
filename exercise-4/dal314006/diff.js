/**
 * Convert a virtual DOM node (vNode) into a real DOM node.
 *
 * @param {Object|string} vNode - A virtual DOM node. Either:
 *   - string → represents a text node
 *   - object → { type: string, props: Object, children: Array }
 * @returns {Node} A real DOM Node (Element or Text)
 */
function createTree(vnode) {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  const el = document.createElement(vnode.type);

  // set attributes
  for (const [key, value] of Object.entries(vnode.props || {})) {
    el.setAttribute(key, value);
  }

  // recursively create children
  (vnode.children || []).forEach(child => {
    el.appendChild(createTree(child));
  });

  return el;
}

/**
 * Diff two virtual DOM nodes and update the real DOM node accordingly.
 * @param {Object|string|null} oldVNode - Previous vDOM node.
 * @param {Object|string|null} newVNode - New vDOM node.
 * @param {Node|null} parentNode - parent of Real DOM node corresponding to oldVNode.
 * @param {number} index - Position of the node within parentNode.
 */
function diff(oldVNode, newVNode, parentNode, index) {

  // The real node the two vnodes describe. Undefined when nothing is mounted
  // at this position yet, which is what Case 2 below handles.
  const domNode = parentNode.childNodes[index];

  // Case 1: both are text (string), but may be different
  if (typeof oldVNode === "string" && typeof newVNode === "string") {
    if (oldVNode !== newVNode) {
      domNode.textContent = newVNode;
    }
    return;
  }

  // Case 2: oldVnode is nullish -> append new node to parent
  if (oldVNode == null && newVNode != null) {
    parentNode.appendChild(createTree(newVNode));
    return;
  }

  // Case 3: newVnode is nullish -> remove
  if (newVNode == null) {
    if (domNode) {
      parentNode.removeChild(domNode);
    }
    return;
  }

  // Case 4: Node type changed -> replace
  // The typeof test catches text turning into an element or the other way
  // round; the .type test catches one tag becoming another.
  if (typeof oldVNode !== typeof newVNode || oldVNode.type !== newVNode.type) {
    parentNode.replaceChild(createTree(newVNode), domNode);
    return;
  }

  // Case 5: Update attributes
  const oldProps = oldVNode.props || {};
  const newProps = newVNode.props || {};

  // remove old attributes not in new
  for (const name of Object.keys(oldProps)) {
    if (!Object.hasOwn(newProps, name)) {
      domNode.removeAttribute(name);
    }
  }

  // add/update new attributes
  for (const [name, value] of Object.entries(newProps)) {
    if (oldProps[name] !== value) {
      domNode.setAttribute(name, value);
    }
  }

  // Recursively diff children
  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];

  for (let i = 0; i < newChildren.length; i++) {
    diff(oldChildren[i], newChildren[i], domNode, i);
  }

  // Anything the old tree had past the end of the new one is dropped here.
  // Walking backwards means a removal only shifts positions already dealt with.
  for (let i = oldChildren.length - 1; i >= newChildren.length; i--) {
    diff(oldChildren[i], newChildren[i], domNode, i);
  }
}
