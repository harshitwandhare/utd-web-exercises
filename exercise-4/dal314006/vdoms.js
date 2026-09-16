/**
 * Test cases for virtual DOM diffing.
 * Each test case contains a "before" and "after" tree.
 * "after" trees include `class: "updated"` to highlight changes.
 *
 * @typedef {Object} VNode
 * @property {string} type - Element type (e.g., "div", "h1").
 * @property {Object<string,string>} [props] - Element attributes.
 * @property {(VNode|string)[]} [children] - Child nodes (strings = text nodes).
 */

/**
 * A collection of test cases.
 * @type {Object<number, {before: VNode, after: VNode}>}
 */
const TEST_CASES = {
  // TEST 1 Simple text and attribute changes
  1: {
    before: {
      type: "div",
      props: { id: "root" },
      children: [
        { type: "h1", props: {}, children: ["Hello World"] },
        { type: "p", props: {}, children: ["This is a simple paragraph."] }
      ]
    },
    after: {
      type: "div",
      props: { id: "root" },
      children: [
        { type: "h1", props: {}, children: ["Hello World"] },
        {
          type: "p",
          props: { class: "updated" },
          children: ["This paragraph has been updated."]
        }
      ]
    }
  },

  // TEST 2 = List modifications (add/remove items)  
  2: {
    before: {
      type: "div",
      props: {id: "root"},
      children: [
        { type: "h1", props: {}, children: ["My Blog"] },
        { type: "p", props: {}, children: ["Welcome to my blog."] },
        {
          type: "ul",
          props: {},
          children: [
            { type: "li", props: {}, children: ["Post 1"] },
            { type: "li", props: {}, children: ["Post 2"] }
          ]
        }
      ]
    },
    after: {
      type: "div",
      props: {id: "root"},
      children: [
        { type: "h1", props: { class: "updated" }, children: ["My Awesome Blog"] },
        { type: "p", props: {}, children: ["Welcome to my updated blog."] },
        {
          type: "ul",
          props: {},
          children: [
            { type: "li", props: {}, children: ["Post 1"] },
            { type: "li", props: { class: "updated" }, children: ["Post 2 (Edited)"] },
            { type: "li", props: { class: "updated" }, children: ["Post 3 (New)"] }
          ]
        }
      ]
    }
  },

  // TEST 3 - Complex nested structure updates
  3: {
    before: {
      type: "div",
      props: { id: "root" },
      children: [
        { type: "header", props: {}, children: [
          { type: "h1", props: {}, children: ["My Site"] },
          { type: "nav", props: {}, children: [
            { type: "ul", props: {}, children: [
              { type: "li", props: {}, children: [
                { type: "a", props: { href: "#home" }, children: ["Home"] }
              ]},
              { type: "li", props: {}, children: [
                { type: "a", props: { href: "#about" }, children: ["About"] }
              ]},
              { type: "li", props: {}, children: [
                { type: "a", props: { href: "#contact" }, children: ["Contact"] }
              ]}
            ]}
          ]}
        ]},
        { type: "main", props: {}, children: [
          { type: "section", props: {}, children: [
            { type: "h2", props: {}, children: ["Welcome"] },
            { type: "p", props: {}, children: ["This is my website."] }
          ]}
        ]},
        { type: "footer", props: {}, children: ["Copyright 2025"] }
      ]
    },
    after: {
      type: "div",
      props: { id: "root" },
      children: [
        { type: "header", props: {}, children: [
          { type: "h1", props: { class: "updated" }, children: ["My Awesome Site"] },
          { type: "nav", props: {}, children: [
            { type: "ul", props: {}, children: [
              { type: "li", props: {}, children: [
                { type: "a", props: { href: "#home", class: "active" }, children: ["Home"] }
              ]},
              { type: "li", props: {}, children: [
                { type: "a", props: { href: "#about" }, children: ["About Us"] }
              ]},
              { type: "li", props: {}, children: [
                { type: "a", props: { href: "#contact", class: "updated" }, children: ["Contact"] }
              ]}
            ]}
          ]}
        ]},
        { type: "main", props: {}, children: [
          { type: "section", props: {}, children: [
            { type: "h2", props: {}, children: ["Welcome"] },
            { type: "p", props: { class: "updated" }, children: ["This is my updated website."] }
          ]}
        ]},
        { type: "footer", props: { class: "updated" }, children: ["© 2025 My Site"] }
      ]
    }
  },

  // Test 4: Remove node (newVNode nullish)
  // Tests removing a child node (going from 3 list items to 2)
  4: {
    before: {
      type: "div",
      props: { id: "root" },
      children: [
        {
          type: "ul",
          props: {},
          children: [
            { type: "li", props: {}, children: ["Item 1"] },
            { type: "li", props: {}, children: ["Item 2"] },
            { type: "li", props: {}, children: ["Item 3"] }
          ]
        }
      ]
    },
    after: {
      type: "div",
      props: { id: "root" },
      children: [
        {
          type: "ul",
          props: {},
          children: [
            { type: "li", props: {}, children: ["Item 1"] },
            { type: "li", props: {}, children: ["Item 2"] }
            // Item 3 is removed
          ]
        }
      ]
    }
  },

  // Test 5: Node type change (replace)
  // Tests when an element's tag type changes (p -> span)
  5: {
    before: {
      type: "div",
      props: { id: "root" },
      children: [
        { type: "h1", props: {}, children: ["Title"] },
        { type: "p", props: { class: "text" }, children: ["This is a paragraph."] },
        { type: "p", props: {}, children: ["Another paragraph."] }
      ]
    },
    after: {
      type: "div",
      props: { id: "root" },
      children: [
        { type: "h1", props: {}, children: ["Title"] },
        { type: "span", props: { class: "updated" }, children: ["This is now a span."] },
        { type: "p", props: {}, children: ["Another paragraph."] }
      ]
    }
  },

  // Test 6: Remove attributes
  // Tests removing attributes that are absent from new VDOM
  6: {
    before: {
      type: "div",
      props: { id: "root" },
      children: [
        { type: "button", props: { id: "btn1", class: "primary", disabled: "true" }, children: ["Click me"] },
        { type: "input", props: { type: "text", id: "input1", placeholder: "Enter text" }, children: [] }
      ]
    },
    after: {
      type: "div",
      props: { id: "root" },
      children: [
        { type: "button", props: { class: "updated" }, children: ["Click me"] },
        { type: "input", props: { type: "text", placeholder: "Enter text" }, children: [] }
      ]
    }
  },

  // Test 7: Update existing attribute value
  // Tests changing the value of an attribute that exists in both VDOMs
  7: {
    before: {
      type: "div",
      props: { id: "root" },
      children: [
        {
          type: "input",
          props: {
            type: "text",
            placeholder: "Enter name"
          },
          children: []
        }
      ]
    },

    after: {
      type: "div",
      props: { id: "root" },
      children: [
        {
          type: "input",
          props: {
            type: "text",
            placeholder: "Enter full name",
            class: "updated"
          },
          children: []
        }
      ]
    }
  },
};
