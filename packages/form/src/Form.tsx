import {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { FormProvider } from "./context";
import { formActions, formValuesSelector } from "./slice";

export interface IFormProps
  extends PropsWithChildren,
    DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  formName: string;
  validate?: (model: any) => object;
}

export const Form = ({
  formName,
  children,
  validate,
  ...props
}: IFormProps) => {
  const dispatch = useDispatch();
  const formModel = useSelector(formValuesSelector(formName, {}));

  useEffect(() => {
    (async () => {
      if (validate) {
        const errors = await validate(formModel);

        // TODO можно прикрутить проверку если прошлый
        // объект ошибок deepEqual. если старый такой же как новый - не кидать экшн
        dispatch(formActions.setErrors({ formName: formName, errors }));
      }
    })();
  }, [formModel, validate]);

  return (
    <form {...props} name={formName}>
      <FormProvider value={{ formName }}>{children}</FormProvider>
    </form>
  );
};
