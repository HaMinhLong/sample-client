const Config = require('./vi-VN/Config');
const UserGroup = require('./vi-VN/UserGroup');

module.exports = {
  'app.common.validate.max300':
    'Vui lòng nhập đúng định dạng tối đa 300 ký tự ',
  'app.table.column.no': '#',
  'app.tooltip.remove': 'Xóa',
  'app.tooltip.edit': 'Sửa',
  'app.title.export': 'Lập điểm tin',
  'app.title.create': 'Thêm mới {name}',
  'app.confirm.remove': 'Bạn có chắc chắn muốn xóa bản ghi?',
  'app.search.placeHolder': 'Tìm kiếm theo tên {functionName}',
  'app.search.label': 'Tên {name}',
  'app.search.button': 'Tìm kiếm',
  'app.common.action': '#',
  'app.common.deleteBtn.cancelText': 'Hủy',
  'app.common.statusTag.-1': 'Xóa tạm',
  'app.common.statusTag.-2': 'Chờ duyệt',
  'app.common.statusTag.1': 'Kích hoạt',
  'app.common.statusTag.0': 'Ẩn',
  'app.common.status.placeholder': 'Tìm kiếm trạng thái',
  'app.common.type.placeholder': 'Tìm kiếm {name}',
  'app.common.placeholder.rangepicker.0': 'Ngày bắt đầu',
  'app.common.placeholder.rangepicker.1': 'Ngày kết thúc',
  'app.common.crudBtns.0': 'Quay lại',
  'app.common.crudBtns.1': 'Làm mới',
  'app.common.crudBtns.2': 'Lưu lại',
  'app.common.crudBtns.3': 'Xuất báo cáo',
  'app.common.searchBtn': 'Tìm kiếm',
  'app.common.delete.success': 'Xóa bản ghi thành công!',
  'app.common.edit.success': 'Cập nhật thông tin thành công!',
  'app.common.export.success': 'Xuất thống kê {name} thành công!',
  'app.common.create.success': 'Thêm mới {name} thành công!',
  'app.common.error.server.msg': 'Có lỗi xảy ra!',
  'app.common.crud.error.update.change':
    'Vui lòng thay đổi thông tin ít nhất 1 trường',
  'app.common.crud.validate.input': 'Vui lòng nhập thông tin',
  'app.common.crud.validate.select': 'Vui lòng chọn thông tin',
  'app.common.crud.validate.fomatUnit':
    'Vui lòng nhập từ 1 đến 50 ký tự bao gồm chữ, số và bắt đầu bằng chữ cái',
  'app.common.crud.validate.fomatMedi':
    'Vui lòng nhập từ 3 đến 50 ký tự bao gồm chữ, số /-, và bắt đầu bằng chữ cái',
  'app.common.crud.validate.fomat':
    'Vui lòng nhập từ 3 đến 50 ký tự bao gồm chữ, số và bắt đầu bằng chữ cái',
  'app.common.crud.validate.fomatNew':
    'Vui lòng nhập ít nhất 3 ký tự bao gồm chữ, số và bắt đầu bằng chữ cái',
  'app.common.crud.validate.formatName':
    'Vui lòng nhập ít nhát 3 ký tự bao gồm chữ, số và ký tự đặc biệt không dấu',
  'app.common.crud.validate.url': 'Vui lòng nhập đúng định dạng url',
  'app.common.crud.validate.phone': 'Vui lòng nhập đúng định dạng sđt',
  'app.common.crud.validate.email': 'Vui lòng nhập đúng định dạng email',
  'app.common.crud.validate.phone_email':
    'Vui lòng nhập đúng định dạng số điện thoại hoặc email',
  'app.common.crud.validate.type':
    'Vui lòng nhập đúng định dạng {name} từ 3 đến 50 ký tự',
  'app.common.validate.max': 'Vui lòng nhập tối đa {max} ký tự',
  'app.common.changeStatus.success': 'Cập nhật trạng thái thành công',
  'app.common.validate.message': 'Vui lòng nhập tin nhắn',
  'app.common.validate.max200': 'Vui lòng nhập tối đa 200 ký tự',

  ...Config,
  ...UserGroup,
};
