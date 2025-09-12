import { h, type ComponentInstance, type VNode } from 'vue';
import {
  ElButton,
  ElSpace,
  ElTableColumn,
  type TableColumnCtx,
  type ButtonProps,
} from 'element-plus';

const PRECOL = {
  index: 'index',
  selection: 'selection',
} as const;

export type TColumns = Partial<TableColumnCtx>;

export interface IColumns extends Omit<Partial<TableColumnCtx>, 'children'> {
  isSlot?: boolean; // 是否使用插槽内容渲染
  children?: IColumns[]; // 子列，递归类型
}

export type TPrecol = (typeof PRECOL)[keyof typeof PRECOL];

export type TSubcol = typeof ElButton;

export interface ISubcol extends Partial<ButtonProps> {
  name: string;
  onClick: (scope: any) => void;
}

// 根据列类型创建列配置
const createColumnByType = (type: TPrecol, options: TColumns) => {
  const width = '55';

  switch (type) {
    case PRECOL.selection:
      return h(ElTableColumn, {
        type: PRECOL.selection,
        width,
        ...options,
      });

    case PRECOL.index:
      return h(ElTableColumn, {
        type: PRECOL.index,
        width,
        ...options,
      });

    default:
      return null;
  }
};

// 递归创建列，支持嵌套 children
const createColumnRecursively = (column: any, slots: any): VNode | null => {
  const { children, isSlot: useSlots, ...columnProps } = column;

  // 首先检查是否配置了 isSlot: true，查找对应的插槽内容
  let slotContent = null;
  let mergedProps = columnProps;

  if (useSlots && column.prop) {
    // 在默认插槽中查找对应prop的LwTableColumn组件
    if (slots.default) {
      const defaultSlots = slots.default();
      const targetSlot = defaultSlots.find(
        (vnode: any) => vnode?.props?.prop === column.prop,
      );

      if (targetSlot) {
        // 找到对应插槽，提取插槽内容和属性
        slotContent = targetSlot.children;
        mergedProps = { ...columnProps, ...targetSlot.props };
      } else {
        // 配置了 isSlot: true 但没有找到对应插槽，不渲染该列
        return null;
      }
    } else {
      // 配置了 isSlot: true 但没有默认插槽，不渲染该列
      return null;
    }
  }

  // 如果有 children，创建带有子列的表格列
  if (children && children.length > 0) {
    const validChildren = children
      .map((child: any) => createColumnRecursively(child, slots))
      .filter(Boolean); // 过滤掉null值（没有对应插槽的slots:true子列）

    // 如果有有效的子列，创建父列
    if (validChildren.length > 0) {
      // 如果同时有插槽内容，将插槽内容与子列合并
      const columnSlots = slotContent || {};
      if (!columnSlots.default) {
        columnSlots.default = () => validChildren;
      }

      return h(ElTableColumn, mergedProps, columnSlots);
    }
    // 如果所有子列都被过滤掉了，父列也不渲染
    return null;
  }

  // 如果有插槽内容，使用插槽渲染
  if (slotContent) {
    return h(ElTableColumn, mergedProps, slotContent);
  }

  // 没有 children 也没有插槽的普通列
  return h(ElTableColumn, columnProps);
};

// 动态构建插槽内容
export const buildSlots = (vm: ComponentInstance<any>, props: any) => {
  const slots = { ...vm!.slots };
  // 构建所有需要渲染的节点
  const allNodes: VNode[] = [];

  // 添加前置列（precol）到最前面
  if (props.precol.length) {
    const precolNodes = props.precol
      .map(createColumnByType)
      .filter(Boolean) as VNode[];
    allNodes.push(...precolNodes);
  }

  // 如果有columns，按照columns顺序添加列（支持嵌套和插槽）
  if (props.columns.length) {
    const columnNodes = props.columns
      .map((column: any) => createColumnRecursively(column, slots))
      .filter(Boolean); // 过滤掉null值（没有对应插槽的slots:true列）
    allNodes.push(...columnNodes);
  }

  // 添加没有在columns中定义的插槽内容
  if (slots.default) {
    // 获取已经在columns中使用的插槽名称
    const usedSlotNames = new Set();
    const collectUsedSlots = (columns: any[]) => {
      columns.forEach((column: any) => {
        if (column.isSlot && column.prop) {
          usedSlotNames.add(column.prop);
        }
        if (column.children) {
          collectUsedSlots(column.children);
        }
      });
    };
    collectUsedSlots(props.columns);

    // 只添加未被columns使用的插槽内容
    const originalDefault = slots.default;
    const defaultSlots = originalDefault();
    const unusedSlots = defaultSlots.filter((vnode: any) => {
      // 检查是否是LwTableColumn组件且prop属性未被columns使用
      if (vnode?.props?.prop && usedSlotNames.has(vnode.props.prop)) {
        return false;
      }
      return true;
    });

    if (unusedSlots.length > 0) {
      allNodes.push(...unusedSlots);
    }
  }

  // 添加后置列（subcol）到最后面
  if (props.subcol.length) {
    const subcolNode = h(
      ElTableColumn,
      {
        label: '操作',
        fixed: 'right',
        align: 'center',
        minWidth: '120',
        ...props.subcolOptions,
      },
      {
        default: (scope: any) =>
          h(
            ElSpace,
            {},
            {
              default: () =>
                props.subcol.map((buttonConfig: ISubcol) => {
                  const newButtonConfig = {
                    ...buttonConfig,
                    onClick: () => buttonConfig.onClick(scope),
                  };
                  return h(ElButton, newButtonConfig, {
                    default: () => buttonConfig.name,
                  });
                }),
            },
          ),
      },
    );
    allNodes.push(subcolNode);
  }

  // 如果有任何节点需要渲染，创建默认插槽
  if (allNodes.length > 0) {
    slots.default = () => allNodes;
  }

  return slots;
};
