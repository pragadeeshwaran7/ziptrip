# Challenge 1 - Question 4: CSS Selectors Analysis

Below is the provided HTML snippet for reference:

```html
01 <div id="container">
02    <div class="box"></div>
03
04    <div class="box2"></div>
05    <div>
06        <div class="box"></div>
07    </div>
08 </div>
09
10 <div class="box"></div>
```

*(Note: We assume standard double-quotes `"` instead of the curly quotes `”` in the question prompt for proper HTML parsing).*

---

### Selector 1: `.box`

* **Selected Line Numbers**: **02, 06, 10**
* **Why it selects them**:
  * The class selector `.box` matches any element with a `class` attribute containing the value `box`.
  * **Line 02** matches because it has `class="box"`.
  * **Line 06** matches because it has `class="box"`.
  * **Line 10** matches because it has `class="box"`.
* **Why it doesn't select other lines**:
  * **Line 01** has an `id` of `container` but no class of `box`.
  * **Line 04** has `class="box2"`, which is a different class name and does not match `.box`.
  * **Line 05** is a plain `div` with no class attribute.

---

### Selector 2: `div .box`

* **Selected Line Numbers**: **02, 06**
* **Why it selects them**:
  * This is a **descendant selector** that selects any element with the class `box` that is located anywhere inside (nested within) a `div` element.
  * **Line 02** is a descendant of the `div` on Line 01 (`#container`).
  * **Line 06** is a descendant of the `div` on Line 05 (and also the `div` on Line 01).
* **Why it doesn't select other lines**:
  * **Line 10** is an element with class `box`, but it is at the root level of the HTML snippet. It is not nested inside any `div` (its parent is the root document body, not another `div`). Therefore, it does not satisfy the descendant requirement.
  * Other lines do not have the class `box`.

---

### Selector 3: `div.box`

* **Selected Line Numbers**: **02, 06, 10**
* **Why it selects them**:
  * This is a **compound selector** that matches any `div` element that *also* has the class `box`.
  * **Line 02** is a `div` element and has `class="box"`.
  * **Line 06** is a `div` element and has `class="box"`.
  * **Line 10** is a `div` element and has `class="box"`.
* **Why it doesn't select other lines**:
  * Other elements inside the snippet (like Lines 01, 04, 05) do not have the class `box` (even though they are `div`s).

---

### Selector 4: `[class]`

* **Selected Line Numbers**: **02, 04, 06, 10**
* **Why it selects them**:
  * This is an **attribute selector** that matches any element that possesses the `class` attribute, regardless of what its class value is.
  * **Line 02** has `class="box"`.
  * **Line 04** has `class="box2"`.
  * **Line 06** has `class="box"`.
  * **Line 10** has `class="box"`.
* **Why it doesn't select other lines**:
  * **Line 01** has an `id` attribute (`id="container"`) but does not have a `class` attribute.
  * **Line 05** is a plain `div` and does not have a `class` attribute.

---

### Selector 5: `#container .box`

* **Selected Line Numbers**: **02, 06**
* **Why it selects them**:
  * This is a **descendant selector** that selects elements with the class `box` that are descendants of the element with the ID `container`.
  * **Line 02** is inside `#container` and has the class `box`.
  * **Line 06** is inside `#container` (nested inside the child `div` on Line 05) and has the class `box`.
* **Why it doesn't select other lines**:
  * **Line 10** has class `box` but is located outside the `#container` element entirely.
  * Other lines inside `#container` (like Line 04 and Line 05) do not have the class `box`.

---

### Selector 6: `#container > .box`

* **Selected Line Numbers**: **02**
* **Why it selects them**:
  * This is a **child selector** (using the `>` combinator). It selects only elements with class `box` that are **direct children** (one level down) of the element with ID `container`.
  * **Line 02** is a direct child of the `#container` element.
* **Why it doesn't select other lines**:
  * **Line 06** has class `box` but is a child of the `div` on Line 05, which in turn is a child of `#container`. This makes Line 06 a grandchild (descendant) of `#container`, not a direct child.
  * **Line 10** is outside `#container`.
  * **Line 04** is a direct child of `#container` but has class `box2`, not `box`.
  * **Line 05** is a direct child of `#container` but has no class.
