import type { ButtonProps } from 'element-plus';
import type { ISubcol } from '~/components/global/LwTable';

// 预设操作
function createOperation(
  name: string,
  type = 'primary' as ButtonProps['type'],
) {
  return (
    handler: (scope: any) => void,
    options = {} as Partial<ISubcol>,
  ): ISubcol => {
    return {
      type,
      name,
      ...options,
      onClick: handler,
    };
  };
}

const useTable = () => {
  const createEdit = createOperation('编辑');
  const createView = createOperation('查看');
  const createDelete = createOperation('删除', 'danger');

  return {
    createEdit,
    createView,
    createDelete,
  };
};

export default useTable;
