export class Utils {
  /**
   * Установка значения свойства модели (например при обработке опциональных параметров методов API)
   * @param entity
   * @param {PN} propName
   * @param {E[P] | undefined} value значение, которого может и не быть
   */
  static setEntityProperty<E, PN extends keyof E>(
    entity: E,
    propName: PN,
    value?: E[PN],
  ) {
    if (value !== undefined) {
      entity[propName] = value;
    }
  }

  static omitProps<S, P extends keyof S, C = Pick<S, Exclude<keyof S, P>>>(
    source: S,
    props: P[],
  ): C {
    const clone: any = {};

    Object.keys(source).forEach(propName => {
      if (props.indexOf(<P>propName) === -1) {
        const p = <P>propName;

        clone[p] = source[p];
      }
    });

    return clone as C;
  }

  static pickProps<
    S,
    P extends keyof S,
    C extends Pick<S, Extract<keyof S, P>>
  >(source: S, props: P[]): C {
    const clone: any = {};

    Object.keys(source).forEach(propName => {
      if (props.indexOf(<P>propName) !== -1) {
        const p = <P>propName;

        clone[p] = source[p];
      }
    });

    return clone;
  }
}
