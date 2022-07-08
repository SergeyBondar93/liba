Создаёт элемент portal на странице с id="portal" находящимся вне #root 

Необходим для модальных окон и прочих вспомогательных компонентов которые должны быть в отдельном DOM


Использование

```js script
import { Portal } from "@cheaaa/portal";

<Portal>
    <SomeContent />
</Portal>
```

Всегда создаётся только один портал, вне зависимости от того сколько раз переиспользован компонент. children от каждого переиспользования помещаются в одну ноду