import React from 'react';
import FileUpload from 'react-fileupload';//https://www.npmjs.com/package/react-fileupload#api-cn


/**
 * 文件上传组件
 */
export default class FileInput extends React.Component {
    render() {
        // 指定参数
        var options={
            baseUrl: this.props.url,
            chooseAndUpload: this.props.chooseAndUpload,
            paramAddToField: this.props.paramAddToField,
            accept: this.props.accept,
            beforeUpload : this.props.beforeUpload,
            chooseFile : this.props.chooseFile,
            fileFieldName : this.props.fileFieldName,
            uploadSuccess: this.props.uploadSuccess
        };
        let fileinput;
        if (options.chooseAndUpload) {
            fileinput = <FileUpload options={options}>
                <button className={this.props.className} ref="chooseAndUpload">{this.props.btnText || '上传'}</button>
            </FileUpload>;
        }else{
            fileinput = (<FileUpload options={options}>
                <div className="chooseBtn fileinputbox" ref="chooseBtn">
                <span>{this.props.fileName ? this.props.fileName : '请选择文件'}</span>
                <i className="icon icon-upload" />
            </div>
            <button className="uploadBtn submitbtn" ref="uploadBtn">{this.props.btnText || '上传'}</button>
            </FileUpload>);
        }

        /*调用FileUpload,传入options。然后在children中*/
        /*传入两个dom(不一定是button)并设置其ref值。*/
        return fileinput;
    }
}

let PropTypes = React.PropTypes;
FileInput.defaultProps = {
    fileFieldName : false,
    accept: '',
    chooseAndUpload: false
};

FileInput.propTypes = {
    url: PropTypes.string.isRequired,
};