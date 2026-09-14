<%@ Page Title="" Language="VB" MasterPageFile="~/AdminMaster.master" AutoEventWireup="false" CodeFile="DealerCreationDetails.aspx.vb" Inherits="DealerCreationDetails" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeaderContent" Runat="Server">
    <title>DEALER CREATION DETAILS</title>
    <%Dim timestamp As String = DateTime.Now.ToString("yyyy.MM.dd-HH.mm.ss.fff")%>
    <script src="Scripts/FunctionValidator.js" type="text/javascript"></script>
    <link href="includes/sumoselect.css" rel="stylesheet" />
    <script type="text/javascript" language="javascript" src="Scripts/Messages.js"></script>

    <script src="Scripts/ValidateDealerCreationEntry.js?time=<%=timestamp%>" type="text/javascript"></script>

    <script type="text/javascript" language="javascript" src="Scripts/AjaxServices.js"></script>

    <script type="text/javascript" src="Scripts/anchorposition.js"></script>

    <script src="Scripts/Validation.js" type="text/javascript"></script>

    <script src="Scripts/RegEX.js" type="text/javascript"></script>
    
    <script type="text/javascript">

        //function RedirectToListScreen() {
        //    // redirect
        //    window.location.href = "DealerCreationList.aspx";
        //    // return false so that submit will be blocked
        //    return false;
        //}

        function RedirectToListScreen() {
            // Check the query string for hosales value
            var urlParams = new URLSearchParams(window.location.search);
            var hosales = urlParams.get('ishosales');

            // Redirect based on the hosales value
            if (hosales === 'Y') {
                window.location.href = "DealerCreationHoSalesList.aspx";
            } else {
                window.location.href = "DealerCreationList.aspx";
            }

            // return false so that submit will be blocked
            return false;
        }

        function isNumeric(eventObj) {
            var keycode;

            if (eventObj.keyCode) //For IE
                keycode = eventObj.keyCode;
            else if (eventObj.Which)
                keycode = eventObj.Which;  // For FireFox
            else
                keycode = eventObj.charCode; // Other Browser

            if (keycode != 8) //if the key is the backspace key
            {
                if (keycode < 48 || keycode > 57) //if not a number
                    return false; // disable key press
                else
                    return true; // enable key press
            }
        }
    </script>
    <script type="text/javascript">
        function isDecimalUpTo2(eventObj, element) {
            var keycode = eventObj.keyCode || eventObj.which || eventObj.charCode;
            var value = element.value;

            // Allow backspace, tab, left/right arrows, delete
            if (keycode === 8 || keycode === 9 || keycode === 37 || keycode === 39 || keycode === 46) {
                return true;
            }

            // Allow only one dot
            if (keycode === 46) {
                if (value.indexOf('.') !== -1) {
                    return false;
                }
                return true;
            }

            // Allow numbers
            if (keycode >= 48 && keycode <= 57) {
                var dotIndex = value.indexOf('.');
                if (dotIndex !== -1) {
                    var decimals = value.substring(dotIndex + 1);
                    var selectionStart = element.selectionStart;
                    if (selectionStart > dotIndex && decimals.length >= 2) {
                        return false;
                    }
                }
                return true;
            }

            return false;
        }
    </script>

    <link href="includes/css/select2.min.css" rel="stylesheet" />
    <style type="text/css">
        .ajax__calendar_day {
            text-align: center !important;
            padding: 2px 2px !important;
        }

        .ajax__calendar_body {
            height: 170px !important;
            width: 195px !important;
        }

        .ajax__calendar_container {
            width: 195px !important;
        }

        .ajax__calendar_days, .ajax__calendar_months, .ajax__calendar_years {
            height: 170px !important;
            width: 195px !important;
        }

        .ajax__calendar_container tr th, .ajax__calendar_container tr td {
            padding: 0px !important;
            vertical-align: middle;
            font-size: 12px !important;
            line-height: initial !important;
            color: initial !important;
            font-weight: 400 !important;
            letter-spacing: initial !important;
            /*text-align: initial !important;*/
        }

        .singleGideList tr th, .singleGideList tr td {
            border: 1px solid #919191;
            padding: 4px 6px;
            vertical-align: middle;
            font-size: 14px;
            line-height: 16px;
            color: #333;
            font-weight: 400;
            letter-spacing: 0.25px;

            /*background: #ffffff54;*/
            /*text-align: left;*/
        }

        .form-contrl {
            border: 1px solid #b9b9b9 !important;
            padding: 1px 5px !important;
            font-size: 13px !important;
            line-height: 20px;
            color: #333;
            font-weight: 400;
            letter-spacing: 0.25px;
            height: 22px;
            width: 92%;
            border-radius: 4px;
            display: block;
            font-family: Verdana, Arial, Tahoma, Helvetica, Sans-Serif;
            background: #FFF;
            outline: 0;
        }

        .select2-results__option {
            border-bottom: 1px solid #b9b9b9;
            font-size: 13px;
            line-height: 16px;
            color: #333;
            font-weight: 400;
            letter-spacing: 0.25px;
            display: block;
            font-family: Verdana, Arial, Tahoma, Helvetica, Sans-Serif;
            white-space: normal;
        }

        .SumoSelect {
            width: 96% !important;
        }

            .SumoSelect > .CaptionCont {
                border: 1px solid #b9b9b9;
                padding: 1px 5px;
                font-size: 13px;
                line-height: 20px;
                color: #333;
                font-weight: 400;
                letter-spacing: 0.25px;
                height: 22px;
                border-radius: 4px;
                display: block;
                font-family: Verdana, Arial, Tahoma, Helvetica, Sans-Serif;
            }

            .SumoSelect .optWrapper {
                width: 100% !important;
            }

            .SumoSelect .select-all {
                padding: 0px 0px 5px 35px !important;
                height: 13px !important;
            }

        .singleGideList tr td .select2-container {
            width: 95% !important;
            max-width: 371px;
        }

        .footerTDStyle td .select2-container {
            max-width: 255px !important;
        }

        .dropDown {
            height: 28px !important;
            /*width: 99% !important;*/
        }

        .custTheader {
            text-align: center !important;
            font-size: 13px !important;
            line-height: 16px !important;
            /*color: #FFF !important;*/
            font-weight: 600 !important;
            letter-spacing: 0.25px !important;
            /*background: #25a851 !important;*/
            background-color: #d9edf7 !important;
            color: #31708f !important;
        }

        .flexCView {
            display: flex;
            align-items: center;
        }

            .flexCView .but1 {
                margin-left: 10px;
            }

        .innerTable {
            width: 100%;
        }

            .innerTable tr td {
                border-width: 0px 1px 1px 0px;
            }

                .innerTable tr td:last-child {
                    border-right: 0px;
                }

            .innerTable tr:last-child td {
                border-bottom: 0px;
            }

        .labelDataPoint {
            background: #FFF;
            line-height: 20px;
        }

        .SumoSelect {
            width: 75px;
            display: flex;
            justify-content: center;
        }

            .SumoSelect p {
                width: 95%;
            }

            .SumoSelect .optWrapper {
                width: 180px;
                text-align: start;
            }

        .tlheader_1 th {
            color: #FFF !important;
        }

        .gridValidationMsg tr td {
            border: 0px;
            font-size: 13px;
            padding: 2px 0px;
            color: inherit;
        }

        .rejctBtnGrid {
            color: #fff !important;
            background: #610c0c;
            background-image: -webkit-linear-gradient(top, #f74848, #610c0c);
            background-image: -moz-linear-gradient(top, #f74848, #610c0c);
            background-image: -ms-linear-gradient(top, #f74848, #610c0c);
            background-image: -o-linear-gradient(top, #f74848, #610c0c);
            background-image: linear-gradient(to bottom, #f74848, #610c0c);
            border: solid #8d1f1f 2px;
        }

            .rejctBtnGrid:hover {
                color: #fff !important;
                background: #610c0c;
                background-image: -webkit-linear-gradient(top, #610c0c, #f74848);
                background-image: -moz-linear-gradient(top, #610c0c, #f74848);
                background-image: -ms-linear-gradient(top, #610c0c, #f74848);
                background-image: -o-linear-gradient(top, #610c0c, #f74848);
                background-image: linear-gradient(to bottom, #610c0c, #f74848);
                border: solid #8d1f1f 2px;
            }

        .backtoAdminBtnGrid {
            color: #fff !important;
            background: #a85a00;
            background-image: -webkit-linear-gradient(top, #ffb347, #a85a00);
            background-image: -moz-linear-gradient(top, #ffb347, #a85a00);
            background-image: -ms-linear-gradient(top, #ffb347, #a85a00);
            background-image: -o-linear-gradient(top, #ffb347, #a85a00);
            background-image: linear-gradient(to bottom, #ffb347, #a85a00);
            border: solid #8a4b00 2px;
        }

            .backtoAdminBtnGrid:hover {
                color: #fff !important;
                background: #a85a00;
                background-image: -webkit-linear-gradient(top, #a85a00, #ffb347);
                background-image: -moz-linear-gradient(top, #a85a00, #ffb347);
                background-image: -ms-linear-gradient(top, #a85a00, #ffb347);
                background-image: -o-linear-gradient(top, #a85a00, #ffb347);
                background-image: linear-gradient(to bottom, #a85a00, #ffb347);
                border: solid #8a4b00 2px;
            }

        .approveBtnGrid {
            color: #fff !important;
            background: #1f8b3b;
            background-image: -webkit-linear-gradient(top, #28a745, #1f8b3b);
            background-image: -moz-linear-gradient(top, #28a745, #1f8b3b);
            background-image: -ms-linear-gradient(top, #28a745, #1f8b3b);
            background-image: -o-linear-gradient(top, #28a745, #1f8b3b);
            background-image: linear-gradient(to bottom, #28a745, #1f8b3b);
            border: solid #1b7430 2px;
        }

            .approveBtnGrid:hover {
                color: #fff !important;
                background: #1f8b3b;
                background-image: -webkit-linear-gradient(top, #1f8b3b, #28a745);
                background-image: -moz-linear-gradient(top, #1f8b3b, #28a745);
                background-image: -ms-linear-gradient(top, #1f8b3b, #28a745);
                background-image: -o-linear-gradient(top, #1f8b3b, #28a745);
                background-image: linear-gradient(to bottom, #1f8b3b, #28a745);
                border: solid #1b7430 2px;
            }

        .whiteTextBtn {
            color: #fff !important;
        }

            .whiteTextBtn:hover {
                color: #fff !important;
            }

        .backDarkBtn {
            color: #fff !important;
            background: #4b4b4b;
            background-image: -webkit-linear-gradient(top, #5a5a5a, #3f3f3f);
            background-image: -moz-linear-gradient(top, #5a5a5a, #3f3f3f);
            background-image: -ms-linear-gradient(top, #5a5a5a, #3f3f3f);
            background-image: -o-linear-gradient(top, #5a5a5a, #3f3f3f);
            background-image: linear-gradient(to bottom, #5a5a5a, #3f3f3f);
            border: solid #353535 2px;
        }

            .backDarkBtn:hover {
                color: #fff !important;
                background: #3f3f3f;
                background-image: -webkit-linear-gradient(top, #3f3f3f, #5a5a5a);
                background-image: -moz-linear-gradient(top, #3f3f3f, #5a5a5a);
                background-image: -ms-linear-gradient(top, #3f3f3f, #5a5a5a);
                background-image: -o-linear-gradient(top, #3f3f3f, #5a5a5a);
                background-image: linear-gradient(to bottom, #3f3f3f, #5a5a5a);
                border: solid #353535 2px;
            }

        .p-mdc-modal {
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%);
            width: 40%;
            height: fit-content !important;
            min-height: 160px;
            max-width: 520px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #cfd8dc;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
            background: #fff;
        }

        .p-popup-label {
            padding: 10px 14px;
            background: linear-gradient(180deg, #1f4f73, #173c59);
        }

        .p-modal-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            column-gap: 10px;
            padding: 0 0 12px;
        }

        .p-update-btn {
            background: #007BFF;
            background-image: linear-gradient(to bottom, #007BFF, #03366c);
        }

            .p-update-btn:hover {
                background-image: linear-gradient(to bottom, #03366c, #007BFF);
            }

        .p-mdc-form-item textarea {
            height: auto !important;
            width: 97% !important;
        }

        .p-mdc-form-item span {
            font-size: 14px;
            text-align: left;
            margin-bottom: 6px;
            display: block;
        }

        .p-main-modal {
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%);
            width: 420px;
            max-width: 90vw;
            min-height: 170px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #cfd8dc;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
            background: #fff;
        }

            .p-main-modal .popupLabel {
                padding: 10px 14px;
                background: linear-gradient(180deg, #1f4f73, #173c59);
            }

            .p-main-modal .popup-message {
                text-align: center;
                padding: 14px 16px;
                min-height: 76px;
                max-height: 190px;
                overflow-y: auto;
                word-break: break-word;
            }

            .p-main-modal .popup-actions {
                display: flex;
                justify-content: center;
                padding: 0 0 14px;
            }

                .p-main-modal .popup-actions .but1 {
                    min-width: 110px;
                }

        .dc-title-wrap {
            width: 60%;
            margin: 0 auto 8px;
            padding: 0;
        }

            .dc-title-wrap .title_left {
                width: 100%;
                margin: 0;
                padding: 0;
            }

            .dc-title-wrap .title_left h3 {
                margin: 0;
                padding: 0;
            }
        
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="BodyContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <asp:UpdateProgress ID="updProgress" runat="server" DisplayAfter="0" AssociatedUpdatePanelID="UpdatePanel1">
        <ProgressTemplate>
            <div style="background-color: #f2f2f2; z-index: 9999999; position: fixed; color: #7f0037; border: 2px solid #7f0037; padding: 5px; width: 150px; height: 50px; vertical-align: middle; text-align: center; top: 48%; left: 43%;">
                <img alt="progress" src="images/ajax-loader.gif" /><br />
                Processing...Please Wait.           
            </div>
            <div class="modal_background">
            </div>
        </ProgressTemplate>
    </asp:UpdateProgress>
    <div class="dc-page-bg">
    <br />
    <div class="page-title dc-title-wrap">
        <div class="title_left">
            <h3>DEALER CREATION DETAILS</h3>
        </div>
    </div>
    <br />
    <br />
    <asp:UpdatePanel runat="server" ID="UpdatePanel1">
        <ContentTemplate>
            <table class="singleGideList" style="width: 60%; margin: 0px auto; text-align: left; border-collapse: collapse;">

                <tr>
                    <td colspan="2" class="custTheader">- Dealer Details -</td>
                </tr>

                <tr>
                    <td style="width: 50%; text-align: left;">Request Id:<span id="SpanRequestID" class="mandatory">* </span></td>
                    <td style="width: 50%; text-align: left;">
                        <asp:HiddenField ID="hdnRequestID" runat="server" />
                        <asp:HiddenField ID="hdnstatus" runat="server" />
                        <asp:HiddenField ID="hdnUserGroup" runat="server" />
                        <asp:Label ID="lblRequestID" TabIndex="2" runat="server" MaxLength="20" CssClass="form-contrl"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>Requisition Date:<span id="Span13" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtReqDate" runat="server" MaxLength="10" AutoComplete="off"
                            CssClass="form-contrl"></asp:TextBox>
                        <ajaxToolkit:CalendarExtender ID="CalendarExtender2" runat="server" TargetControlID="txtReqDate"
                            Format="dd/MM/yyyy" />
                    </td>
                </tr>
                <tr>
                    <td style="width: 50%; text-align: left;">Code Generation No:<span id="Span1" class="mandatory">* </span></td>
                    <td style="width: 50%; text-align: left;">
                        <asp:Label ID="lblCodeGenerationNo" TabIndex="2" runat="server" CssClass="form-contrl"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td style="width: 50%; text-align: left;">New Account Code:</td>
                    <td style="width: 50%; text-align: left;">
                        <asp:Label ID="lblnewacc" TabIndex="2" runat="server" CssClass="form-contrl"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td style="width: 50%; text-align: left;">New Bill To Code:</td>
                    <td style="width: 50%; text-align: left;">
                        <asp:Label ID="lblnewbillto" TabIndex="2" runat="server" CssClass="form-contrl"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>Region:<span id="SpanRegion" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlRegion" runat="server" CssClass="form-contrl dropDown select2" AutoPostBack="true" OnSelectedIndexChanged="ddlRegion_SelectedIndexChanged">
                            <asp:ListItem Value="">Select</asp:ListItem>
                        </asp:DropDownList>
                    </td>
                </tr>
                <tr>
                    <td>Depot:<span id="SpanDepot" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlDepot" runat="server" TabIndex="3" CssClass="form-contrl dropDown select2" AutoPostBack="true" OnSelectedIndexChanged="ddlDepot_SelectedIndexChanged">
                        </asp:DropDownList>
                    </td>
                </tr>


                <%-- <tr>
                    <td>Dealer Status:<span id="Span3" class="mandatory">*</span></td>
                    <td>
                       
                        <asp:DropDownList ID="ddlDealerStatus" runat="server" CssClass="form-contrl dropDown select2" TabIndex="1">
                        </asp:DropDownList>
                    </td>
                </tr>--%>
                <%--<tr>
                    <td>Store:<span id="SpanStore" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlStoreYN" runat="server" CssClass="form-contrl dropDown select2" Enabled="false">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="N">No</asp:ListItem>
                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                        </asp:DropDownList>
                    </td>
                </tr>--%>
                <tr>
                    <td>Business Channel:<span id="Span2" class="mandatory">*</span></td>
                    <td>

                        <asp:DropDownList ID="ddlBusinessChannel" runat="server" CssClass="form-contrl dropDown select2" AutoPostBack="true" OnSelectedIndexChanged="ddlBusinessChannel_SelectedIndexChanged" TabIndex="5">
                            <asp:ListItem Value="" Selected="True">Select</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>Sub Function:<span id="Span9" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlSubFunction" runat="server" CssClass="form-contrl dropDown select2" TabIndex="6" AutoPostBack="true" OnSelectedIndexChanged="ddlSubFunction_SelectedIndexChanged">
                            <asp:ListItem Value="" Selected="True">Select</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr id="pnlCustomerClass" runat="server" visible="false">
                    <td>Customer Class:<span id="SpanCustomerClass" class="mandatory">*</span>
                    </td>
                    <td>
                        <asp:DropDownList ID="ddlCustomerClass" runat="server" TabIndex="7"
                            CssClass="form-contrl dropDown select2" AutoPostBack="true" OnSelectedIndexChanged="ddlCustomerClass_SelectedIndexChanged">
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>Customer Type:<span id="Span5" class="mandatory">*</span>
                    </td>
                    <td>
                        <asp:DropDownList ID="ddlCustomerType" runat="server" TabIndex="7"
                            CssClass="form-contrl dropDown select2" AutoPostBack="true" OnSelectedIndexChanged="ddlCustomerType_SelectedIndexChanged">
                        </asp:DropDownList>

                    </td>
                </tr>

                <tr>
                    <td>Customer Sub Type:<span id="Span3" class="mandatory">*</span>
                    </td>
                    <td>
                        <asp:DropDownList ID="ddlCustomerSubType" AutoPostBack="true" OnSelectedIndexChanged="ddlCustomerSubType_SelectedIndexChanged" runat="server" TabIndex="8"
                            CssClass="form-contrl dropDown select2">
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr id="pnlLead" runat="server" visible="false">
                    <td>Lead ID:<span id="Span1LeadId" class="mandatory">*</span>
                    </td>
                    <td>
                        <asp:DropDownList ID="ddlLeadID" runat="server" TabIndex="9" AutoPostBack="true" OnSelectedIndexChanged="ddlLeadId_SelectedIndexChanged"
                            CssClass="form-contrl dropDown select2">
                        </asp:DropDownList>
                    </td>
                </tr>
                <tr id="pnlLead1" runat="server" visible="false">
                    <td>Lead Mobile No:<span id="Span11" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtMobilePhoneNo" runat="server" MaxLength="10" TabIndex="8"
                            onkeypress="return  isNumeric(event);" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>
                <tr>
                    <td>Territory :<span id="SpanTerritory" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlTerritory" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                        </asp:DropDownList>
                    </td>
                </tr>
                <tr>
                    <td>GSTIN Available :<span id="Span27" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlGSTINAvailable" runat="server" CssClass="form-contrl dropDown select2" OnSelectedIndexChanged="ddlGSTINAvailable_SelectedIndexChanged" AutoPostBack="true">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                            <asp:ListItem Value="N">No</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr id="pnlGSTIN" runat="server" visible="false">
                    <td>GST Number (15 digit):<span id="SpanGstFull" class="mandatory">*</span></td>
                    <td>
                        <div class="flexCView">
                            <asp:TextBox ID="txtGstFull" runat="server" CssClass="form-contrl" MaxLength="15" AutoPostBack="true" OnTextChanged="txtGstFull_TextChanged" AutoComplete="off" oninput="this.value = this.value.toUpperCase();"></asp:TextBox>
                            <%--           <asp:Button ID="btnGSTValidate" CssClass="but1" runat="server" Text="Validate" Width="100px" />--%>
                        </div>
                        <asp:Label ID="lblValidateGST" runat="server" ForeColor="Red" Text=""></asp:Label>
                    </td>
                </tr>
                <tr id="pnlGSTIN1" runat="server" visible="false">
                    <td>GST Tax Payee Type :<span id="SpanGstType" class="mandatory">*</span></td>
                    <td>
                        <%--<asp:DropDownList ID="ddlGstType" runat="server" CssClass="form-contrl dropDown select2" OnSelectedIndexChanged="ddlGstType_SelectedIndexChanged" AutoPostBack="true">
                            <asp:ListItem Value="">Select</asp:ListItem>
                        </asp:DropDownList>--%>
                        <asp:TextBox ID="txtGstType" runat="server" TabIndex="8" CssClass="form-contrl" OnTextChanged="txtGstType_TextChanged" AutoPostBack="true" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>
                <tr id="pnlGSTIN2" runat="server" visible="false">
                    <td>GST Date of Registration:<span id="SpanGstDate" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtGstDate" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>
                        <ajaxToolkit:CalendarExtender ID="CalendarExtender1" runat="server" TargetControlID="txtGstDate"
                            Format="dd/MM/yyyy" />
                    </td>
                </tr>
                <tr>
                    <td>PAN No :<span id="SpanPanTanNo" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtPanTanNo" runat="server" MaxLength="10" CssClass="form-contrl" OnTextChanged="txtPanTanNo_TextChanged" AutoPostBack="true" AutoComplete="off" oninput="this.value = this.value.toUpperCase();"></asp:TextBox>
                        <asp:Label ID="lblValidatePANNumber" runat="server" ForeColor="Red" Text=""></asp:Label>

                    </td>
                </tr>
                <%-- <tr>
                    <td>Is The Turnover Of The Dealer Less Than:<span id="SpanTurnover" class="mandatory">*</span>
                        <div class="mandatory" style="font-size: 9px; font-weight: 500;">For Service Providers – 20 Lacs/10 Lacs (Hilly States)</div>
                        <div class="mandatory" style="font-size: 9px; font-weight: 500;">For Goods Sellers – 40 Lacs/20 Lacs (Hilly States)</div>
                    </td>
                    <td>
                        <asp:DropDownList ID="ddlTurnoverLimit" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                            <asp:ListItem Value="N">No</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>--%>
                <tr>
                    <td>Firm Type:<span id="Span28" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlFirmType" runat="server" CssClass="form-contrl dropDown select2 select2" AutoPostBack="true" OnSelectedIndexChanged="ddlFirmType_SelectedIndexChanged">
                            <asp:ListItem Value="">Select</asp:ListItem>
                        </asp:DropDownList>
                    </td>
                </tr>
                <tr id="pnlProprietorAadhaar" runat="server" visible="false">
                    <td>Proprietor Aadhaar No:<span id="Span31" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtAadhar" runat="server" MaxLength="12" CssClass="form-contrl" AutoComplete="off" oninput="this.value = this.value.toUpperCase();"></asp:TextBox>
                    </td>
                </tr>
                <%-- <tr>
                    <td>TSI Name: <span id="SpanTSI" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtTSIName" runat="server" CssClass="form-contrl"></asp:TextBox>

                    </td>
                </tr>--%>



                <%-- <tr>
                    <td>Reason for Error :</td>
                    <td>
                        <asp:TextBox ID="txtReason" runat="server" CssClass="form-contrl"></asp:TextBox>
                    </td>
                </tr>--%>
                <tr id="pnlMotherAccount" runat="server" visible="false">
                    <td>Mother Account Code: <span id="SpanMotherAcc" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtMotherAccountCode" runat="server" CssClass="form-contrl" AutoComplete="off"
                            MaxLength="10" onkeypress="return isNumeric(event);"></asp:TextBox>
                    </td>
                </tr>
                <tr id="pnlDistributorRetailer" runat="server" visible="false">
                    <td>
                        <asp:Label ID="lblparentac" runat="server"> Distributor Parent A/C: </asp:Label>
                        <span id="SpanDistributorParent" class="mandatory">*</span></td>
                    <td>
                        <div class="flexCView">
                            <asp:TextBox ID="txtDistributorParentAcc" runat="server" CssClass="form-contrl" AutoComplete="off"
                                MaxLength="10" onkeypress="return isNumeric(event);"></asp:TextBox>
                            <asp:HiddenField ID="hdnValidateDistributorParentAcc" runat="server" />
                            <asp:Button ID="btnValidateDistributorParentAcc" CssClass="but1" runat="server" Text="Validate" Width="100px" OnClick="btnValidateDistributorParentAcc_Click" />

                        </div>
                        <asp:Label ID="lblValidateDistributorParentAcc" runat="server" ForeColor="Red" Text=""></asp:Label>
                    </td>
                </tr>
                <tr id="pnlDistributorRetailer2" runat="server" visible="false">
                    <td>Retailer Contact No: <span id="SpanRetailerContactNo" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtRetailerContactNo" runat="server" CssClass="form-contrl" AutoComplete="off"
                            MaxLength="10" onkeypress="return isNumeric(event);"></asp:TextBox>
                    </td>
                </tr>
                <tr id="pnlDistributorRetailer3" runat="server" visible="false">
                    <td>Retailer Alternate Contact No:</td>
                    <td>
                        <asp:TextBox ID="txtRetailerAlternateContactNo" runat="server" CssClass="form-contrl" AutoComplete="off"
                            MaxLength="10" onkeypress="return isNumeric(event);"></asp:TextBox>
                    </td>
                </tr>
                <tr id="pnlDistributorRetailer4" runat="server" visible="false">
                    <td>Club Class: <span id="SpanClubClass" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlClubClass" runat="server" CssClass="form-contrl dropDown select2 select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                        </asp:DropDownList>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center;" class="custTheader">- DEPOT -
                    </td>
                </tr>
                <tr>
                    <td>Account Name: <span id="SpanAcc" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtAccountName" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>
                <tr>
                    <td>Primary Site:<span id="SpanSite" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlPrimarySite" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="Y" Selected="True">Yes</asp:ListItem>
                            <asp:ListItem Value="N">No</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>State:<span id="Span6" class="mandatory">*</span><td>
                        <asp:DropDownList ID="ddlState" runat="server" TabIndex="10"
                            CssClass="form-contrl dropDown select2" OnSelectedIndexChanged="ddlState_SelectedIndexChanged" AutoPostBack="true">
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>District:<span id="SpanDist" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlDistrict" runat="server" CssClass="form-contrl dropDown select2" OnSelectedIndexChanged="ddlDistrict_SelectedIndexChanged" AutoPostBack="true">
                            <asp:ListItem Value="">Select</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>City:<span id="SpanCity" class="mandatory">*</span></td>
                    <td>
                        <%-- <asp:DropDownList ID="ddlCity" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem  Value="">Select</asp:ListItem>
                        </asp:DropDownList>--%>
                        <asp:TextBox ID="txtCity" runat="server" CssClass="form-contrl" OnTextChanged="txtCity_TextChanged" AutoPostBack="true" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>Country:<span id="SpanCountry" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlCountry" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="INDIA" Selected="True">INDIA</asp:ListItem>
                        </asp:DropDownList>
                    </td>
                </tr>
                <tr>
                    <td>Discount Type:<span id="SpanDiscountType" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlDiscountType1" runat="server" CssClass="form-contrl dropDown select2" AutoPostBack="true" OnSelectedIndexChanged="ddlDiscountType1_SelectedIndexChanged">
                            <asp:ListItem Value="">Select</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>Address [1]:<span id="Span32" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlAddress1" runat="server" CssClass="form-contrl dropDown select2" OnSelectedIndexChanged="ddlAddress1_SelectedIndexChanged" AutoPostBack="true">
                        </asp:DropDownList>
                    </td>
                </tr>
                <tr>
                    <td>Address [2]:</td>
                    <td>
                        <asp:TextBox ID="txtAddress2" runat="server" CssClass="form-contrl" OnTextChanged="txtAddress2_TextChanged" AutoPostBack="true" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>Address [3]:</td>
                    <td>
                        <asp:TextBox ID="txtAddress3" runat="server" CssClass="form-contrl" OnTextChanged="txtAddress3_TextChanged" AutoPostBack="true" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>Postal Code:<span id="SpanPostal" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtPostalCode" runat="server" CssClass="form-contrl" MaxLength="6" OnTextChanged="txtPostalCode_TextChanged" AutoPostBack="true" AutoComplete="off"
                            onkeypress="return isNumeric(event);"></asp:TextBox>

                    </td>
                </tr>
                <tr>
                    <td>
                        <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; width: 100%;">
                            <div>Primary Contact Number:<span id="SpanPrimaryContact" class="mandatory">*</span></div>
                            <div style="display: flex; flex-direction: row; align-items: center; gap: 4px;">
                                <input type="checkbox" class="checkboxView" id="whatsChek" runat="server" style="width: 15px; height: 15px; margin: 0;" />
                                <label for="whatsChek" style="margin: 0; line-height: 15px;">It's Whatsapp</label>
                                <img src="images/whatsapp-logo.png" alt="img" style="width: 20px; height: auto; object-fit: contain;" />
                            </div>
                        </div>
                    </td>
                    <td>
                        <asp:TextBox ID="txtPrimaryContactNo" runat="server" CssClass="form-contrl" AutoComplete="off"
                            MaxLength="10" onkeypress="return isNumeric(event);"></asp:TextBox>

                    </td>
                </tr>
                <tr>
                    <td>Primary Contact Person:<span id="SpanPrimaryPerson" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtPrimaryContactPerson" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>
                <tr>
                    <td>Alternate Contact Number [1]:</td>
                    <td>
                        <asp:TextBox ID="txtAltContact1" runat="server" CssClass="form-contrl" AutoComplete="off"
                            MaxLength="10" onkeypress="return isNumeric(event);"></asp:TextBox>
                    </td>
                </tr>
                <%--<tr>
                    <td>Alternate Contact Number [2] :</td>
                    <td>
                        <asp:TextBox ID="txtAltContact2" runat="server" CssClass="form-contrl" AutoComplete="off"
                            MaxLength="10" onkeypress="return isNumeric(event);"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>Alternate Contact Number [3] :</td>
                    <td>
                        <asp:TextBox ID="txtAltContact3" runat="server" CssClass="form-contrl" AutoComplete="off"
                            MaxLength="10" onkeypress="return isNumeric(event);"></asp:TextBox>
                    </td>
                </tr>--%>
                <%--<tr>
                    <td>WhatsApp Number:<span id="SpanWhatsAppNumber" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtWhatsAppNumber" runat="server" CssClass="form-contrl" AutoComplete="off"
                            MaxLength="10" onkeypress="return isNumeric(event);"></asp:TextBox>
                    </td>
                </tr>--%>
                <tr>
                    <td>Alternate Contact Person [1] :</td>
                    <td>
                        <asp:TextBox ID="txtAltPerson1" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <%--<tr>
                    <td>Alternate Contact Person [2] :</td>
                    <td>
                        <asp:TextBox ID="txtAltPerson2" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>--%>
                <tr>
                    <td colspan="2" style="text-align: center;" class="custTheader">- BANKING DETAILS -
                    </td>
                </tr>
                <%--<tr>
                    <td>If Security Deposit already there? :</td>
                    <td>
                        <asp:DropDownList ID="ddlSecurityDeposit" runat="server" CssClass="form-contrl dropDown select2" OnSelectedIndexChanged="ddlSecurityDeposit_SelectedIndexChanged" AutoPostBack="true">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                            <asp:ListItem Value="N">No</asp:ListItem>
                        </asp:DropDownList>
                    </td>
                </tr>--%>
                <tr id="pnlSecurityDeposit" runat="server" visible="false">
                    <td>Security Amount:<span id="SpanSecAmount" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtSecurityAmount" runat="server" CssClass="form-contrl" AutoComplete="off"
                            onkeypress="return isNumeric(event);"></asp:TextBox>

                    </td>
                </tr>
                <tr id="pnlSecurityDeposit1" runat="server" visible="false">
                    <td>Security Deposit A/C No:<span id="SpanSecAcc" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtSecurityAccNo" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>
                <tr id="pnlSecurityChequeCollected" runat="server">
                    <td>Security Cheque collected:<span id="SpanChequeCollected" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlSecurityCheque" runat="server" CssClass="form-contrl dropDown select2" OnSelectedIndexChanged="ddlSecurityCheque_SelectedIndexChanged" AutoPostBack="true">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                            <asp:ListItem Value="N">No</asp:ListItem>
                        </asp:DropDownList>

                    </td>

                </tr>
                <tr id="pnlSecurityCheque" runat="server" visible="false">

                    <td>Security Cheque Number:<span id="SpanChequeNumber" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtChequeNumber" runat="server" CssClass="form-contrl" MaxLength="30" AutoComplete="off" oninput="this.value = this.value.toUpperCase();"></asp:TextBox>

                    </td>
                </tr>
                <tr>
                    <td>Reason:<span id="SpanReason" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlReason" runat="server" CssClass="form-contrl dropDown select2">
                        </asp:DropDownList>

                    </td>

                </tr>
                <tr>
                    <td>Bank Account No:<span id="SpanBankAcc" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtBankAccount" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>
                <tr>
                    <td>Confirm Bank Account No:<span id="SpanConfirmBankAcc" class="mandatory">*</span></td>
                    <td>
                        <div class="flexCView">
                            <asp:TextBox ID="txtConfirmBankAcc" runat="server" CssClass="form-contrl" Style="width: 63%;" AutoComplete="off"></asp:TextBox>
                            <asp:Button ID="btnValidateAccNo" CssClass="but1" runat="server" Text="Validate" OnClick="btnValidateAccNo_Click" Width="100px" />
                        </div>
                        <asp:Label ID="lblValidateBankAcc" runat="server" ForeColor="Red" Text=""></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>IFSC Code:<span id="SpanIFSC" class="mandatory">*</span></td>
                    <td>
                        <div class="flexCView">
                            <asp:TextBox ID="txtIFSC" runat="server" CssClass="form-contrl" Style="width: 63%;" AutoComplete="off" oninput="this.value = this.value.toUpperCase();"></asp:TextBox>
                            <asp:Button ID="btnValidateIFSC" CssClass="but1" runat="server" Text="Validate" OnClick="btnValidateIFSC_Click" Width="100px" />
                            <asp:Button ID="btnReset" CssClass="but1" Text="Reset" runat="server" Visible="false" OnClick="btnReset_Click" Width="100px" />
                        </div>
                        <asp:Label ID="lblValidateIFSC" runat="server" ForeColor="Red" Text=""></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td>Bank Branch Address:<span id="SpanBranch" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtBankBranch" runat="server" CssClass="form-contrl" Enabled="false" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>
                <tr>
                    <td>Bank Name:<span id="SpanBankName" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtBankName" runat="server" CssClass="form-contrl" Enabled="false" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>

                <tr>
                    <td>Bank Account Type:<span id="SpanBankAccountType" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlbankactype" runat="server" CssClass="form-contrl dropDown select2" OnSelectedIndexChanged="ddlbankactype_SelectedIndexChanged" AutoPostBack="true">
                        </asp:DropDownList>

                    </td>
                </tr>

                <tr id="pnlTaxation" runat="server" visible="false">
                    <td colspan="2" style="text-align: center;" class="custTheader">- TAXATION -
                    </td>
                </tr>
                <tr id="pnlTaxation1" runat="server" visible="false">
                    <td>Trade Name (Bill To):</td>
                    <td>
                        <asp:TextBox ID="txtTradeNameBill" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <tr id="pnlTaxation2" runat="server" visible="false">
                    <td>Legal Name (Bill To):</td>
                    <td>
                        <asp:TextBox ID="txtLegalNameBill" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <tr id="pnlTaxation3" runat="server" visible="false">
                    <td>Trade Name (Ship To):</td>
                    <td>
                        <asp:TextBox ID="txtTradeNameShip" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <tr id="pnlTaxation4" runat="server" visible="false">
                    <td>Legal Name (Ship To):</td>
                    <td>
                        <asp:TextBox ID="txtLegalNameShip" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <tr id="pnlTaxation5" runat="server" visible="false">
                    <td>Account No:</td>
                    <td>
                        <asp:Label ID="lblAccountNo" runat="server" CssClass="form-contrl"></asp:Label>
                    </td>
                </tr>
                <tr id="pnlTaxation6" runat="server" visible="false">
                    <td>Bill To Code:</td>
                    <td>
                        <asp:Label ID="lblBillToCode" runat="server" CssClass="form-contrl"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center;" class="custTheader">-   SHIP TO DETAILS -  
                    </td>
                    <%-- <span style="float: right; font-weight: normal; color: #555;">Leaving Blank will copy same address as above</span>--%>
                </tr>
                <tr>
                    <td>Address : Street [1]:</td>
                    <td>
                        <asp:DropDownList ID="ddlShipAddress1" runat="server" CssClass="form-contrl dropDown select2">
                        </asp:DropDownList>
                    </td>
                </tr>
                <tr>
                    <td>Address : Street [2]:</td>
                    <td>
                        <asp:TextBox ID="txtShipAddress2" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>Address : Street [3]:</td>
                    <td>
                        <asp:TextBox ID="txtShipAddress3" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <tr>

                    <td>State:<span id="SpanShipState" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlShipState" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>District: <span id="SpanShipDistrict" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlShipDistrict" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>City:<span id="SpanShipCity" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtShipCity" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>Postal Code:<span id="SpanShipPostal" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtShipPostal" runat="server" CssClass="form-contrl" AutoComplete="off"
                            MaxLength="6" onkeypress="return isNumeric(event);"></asp:TextBox>

                    </td>
                </tr>

                <tr>
                    <td>GST Tax Payee Type:</td>
                    <td>
                        <%-- <asp:DropDownList ID="ddlShipGstType" runat="server" CssClass="form-contrl dropDown select2">
                        </asp:DropDownList>--%>
                        <asp:TextBox ID="txtShipGstType" runat="server" TabIndex="8" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>GST Number (15 digit):</td>
                    <td>
                        <asp:TextBox ID="txtShipGstFull" runat="server" CssClass="form-contrl" MaxLength="15" AutoPostBack="true" OnTextChanged="txtShipGstFull_TextChanged" AutoComplete="off" oninput="this.value = this.value.toUpperCase();"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td>PAN No:</td>
                    <td>
                        <asp:TextBox ID="txtShipPanTanNo" runat="server" MaxLength="10" CssClass="form-contrl" AutoComplete="off" oninput="this.value = this.value.toUpperCase();"></asp:TextBox>
                    </td>
                </tr>
                <%--  <tr>
                    <td>Reason for Error:</td>
                    <td>
                        <asp:TextBox ID="txtShipReason" runat="server" CssClass="form-contrl"></asp:TextBox>
                    </td>
                </tr>--%>
                <tr>
                    <td colspan="2" style="text-align: center;" class="custTheader">- ALTERNATE BUSINESS -
                    </td>
                </tr>
                <tr>
                    <td>Alternate Business :</td>
                    <td>
                        <%--  <asp:DropDownList ID="ddlAlternateBusiness" runat="server" CssClass="form-contrl dropDown select2">
                        </asp:DropDownList>--%>
                        <asp:ListBox ID="ddlAlternateBusiness" runat="server" SelectionMode="Multiple" placeholder="Select" CssClass="sumo cstmSumo"></asp:ListBox>
                    </td>
                </tr>

                <%--<tr>
                    <td>Daily Transaction Limit:<span id="SpanDailyLimit" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtDailyLimit" runat="server" CssClass="form-contrl" AutoComplete="off"
                            MaxLength="10" onkeypress="return isNumeric(event);"></asp:TextBox>

                    </td>
                </tr>--%>
                <%--<tr>
                    <td>Do Not Allow Phone Calls:<span id="SpanDoNotCall" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlDoNotCall" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem  Value="">Select</asp:ListItem>
                            <asp:ListItem>Yes</asp:ListItem>
                            <asp:ListItem>No</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>--%>
                <tr>
                    <td>Email:<span id="SpanEmail" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtEmail" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>

                <%--<tr>
                    <td>Competition Club:<span id="SpanCompetition" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlCompetitionClub" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>--%>
                <%--<tr>
                    <td>Exclusivity:<span id="SpanExclusivity" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlExclusivity" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem>Yes</asp:ListItem>
                            <asp:ListItem>No</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>--%>

                <%--<tr>
                    <td>Maximum Cheque Value Limit: <span id="SpanChequeLimit" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtMaxChequeLimit" runat="server" CssClass="form-contrl" AutoComplete="off"
                            onkeypress="return isNumeric(event);"></asp:TextBox>

                    </td>
                </tr>--%>

                 <tr>
                    <td>Competition Dealer:<span id="SpanCompetitionDealer" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlCompDealer" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                            <asp:ListItem Value="N">No</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>

                <tr>
                    <td>Has the proposed dealer entered into any financial transaction with any employee of Berger Paints India Ltd. or friend/ relative of any employee of Berger?: <span id="SpanFinancialTranYn" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlFinancialTranYn" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                            <asp:ListItem Value="N">No</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>

                <tr>
                    <td>Remarks: <span id="SpanFinancialTranRemark" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtFinancialTranRemark" runat="server" CssClass="form-contrl"></asp:TextBox>

                    </td>
                </tr>

                <tr>
                    <td>Whether the proposed dealer is a relative or friend of a relative of any existing Berger employee : <span id="SpanRelativeOrFriend" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlRelativeOrFriend" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                            <asp:ListItem Value="N">No</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>Please specify the Details Remarks: <span id="SpanRelativeOrFriendRemark" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtRelativeOrFriendRemark" runat="server" CssClass="form-contrl"></asp:TextBox>

                    </td>
                </tr>
                <%-- <tr>
                    <td>Order Type:<span id="SpanOrderType" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlOrderType" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem  Value="">Select</asp:ListItem>
                            <asp:ListItem>Cash</asp:ListItem>
                            <asp:ListItem>Credit</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>--%>
                <%--<tr>
                    <td>If Security Deposit already there? :</td>
                    <td>
                        <asp:DropDownList ID="ddlSecurityDeposit" runat="server" CssClass="form-contrl dropDown select2" OnSelectedIndexChanged="ddlSecurityDeposit_SelectedIndexChanged" AutoPostBack="true">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                            <asp:ListItem Value="N">No</asp:ListItem>
                        </asp:DropDownList>
                    </td>
                </tr>
                <tr id="pnlSecurityDeposit" runat="server" visible="false">
                    <td>Security Amount:<span id="SpanSecAmount" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtSecurityAmount" runat="server" CssClass="form-contrl" AutoComplete="off"
                            onkeypress="return isNumeric(event);"></asp:TextBox>

                    </td>
                </tr>
                <tr id="pnlSecurityDeposit1" runat="server" visible="false">
                    <td>Security Deposit A/C No:<span id="SpanSecAcc" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtSecurityAccNo" runat="server" CssClass="form-contrl" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>
                <tr>
                    <td>Security Cheque collected:<span id="SpanChequeCollected" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlSecurityCheque" runat="server" CssClass="form-contrl dropDown select2" OnSelectedIndexChanged="ddlSecurityCheque_SelectedIndexChanged" AutoPostBack="true">
                            <asp:ListItem Value="">Select</asp:ListItem>
                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                            <asp:ListItem Value="N">No</asp:ListItem>
                        </asp:DropDownList>

                    </td>

                </tr>
                <tr id="pnlSecurityCheque" runat="server" visible="false">

                    <td>Security Cheque Number:<span id="SpanChequeNumber" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtChequeNumber" runat="server" CssClass="form-contrl" MaxLength="30" AutoComplete="off" oninput="this.value = this.value.toUpperCase();"></asp:TextBox>

                    </td>
                </tr>
                <tr>
                    <td>Reason:<span id="SpanReason" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlReason" runat="server" CssClass="form-contrl dropDown select2">
                        </asp:DropDownList>

                    </td>

                </tr>--%>
                <tr id="pnlProposedCredit" runat="server" visible="false">
                    <td>Payment Terms:<span id="SpanPaymentTerms" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlPaymentTerms" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Value="">Select</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr id="pnltlvamount" runat="server" visible="false">
                    <td>TLV Amount:<span id="SpanTLVAmount" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtTLVAmount" runat="server" CssClass="form-contrl" onkeypress="return isNumeric(event);" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>
                <tr id="pnlProposedCredit1" runat="server" visible="false">

                    <td>Proposed Credit Limit:<span id="SpanCreditLimit" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtCreditLimit" runat="server" CssClass="form-contrl" onkeypress="return isNumeric(event);" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>
                <tr id="pnlProposedCredit2" runat="server" visible="false">
                    <td>Proposed Credit Days:<span id="SpanCreditDays" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtCreditDays" runat="server" CssClass="form-contrl" onkeypress="return isNumeric(event);" AutoComplete="off"></asp:TextBox>

                    </td>
                </tr>
                <%--  <tr>
                    <td>Preferred Language [1]:<span id="SpanLang1" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlPreferredLanguage1" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem  Value="">Select</asp:ListItem>
                            <asp:ListItem>English</asp:ListItem>
                            <asp:ListItem>Hindi</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>Preferred Language [2]:<span id="SpanLang2" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlPreferredLanguage2" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem  Value="">Select</asp:ListItem>
                            <asp:ListItem>English</asp:ListItem>
                            <asp:ListItem>Hindi</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>Preferred Time:<span id="SpanPreferredTime" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlPreferredTime" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem  Value="">Select</asp:ListItem>
                            <asp:ListItem>Morning</asp:ListItem>
                            <asp:ListItem>Afternoon</asp:ListItem>
                            <asp:ListItem>Evening</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>--%>
                <%-- <tr>
                    <td>FS Dealer:<span id="SpanFSDealer" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlFSDealer" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem>No</asp:ListItem>
                            <asp:ListItem>Yes</asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>
                <tr>
                    <td>ATR%:<span id="Span7" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtATR" runat="server" CssClass="form-contrl"></asp:TextBox>

                    </td>
                </tr>
                <tr>
                    <td>Special Discount%:<span id="Span8" class="mandatory">*</span></td>
                    <td>
                        <asp:TextBox ID="txtSpecialDiscount" runat="server" CssClass="form-contrl"></asp:TextBox>

                    </td>
                </tr>--%>
                <tr>
                    <td colspan="2" style="text-align: center;" class="custTheader">- DN SLAB -
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 0px;">
                        <table class="innerTable" border="0" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="width: 25%;">Dn1 Day:</td>
                                <td style="width: 25%;">
                                    <asp:TextBox ID="txtDn1Day" runat="server" CssClass="form-contrl" onkeypress="return isNumeric(event);" AutoComplete="off"></asp:TextBox></td>
                                <td style="width: 25%;">Dn1 %:</td>
                                <td style="width: 25%;">
                                    <asp:TextBox ID="txtDn1Percent" runat="server" CssClass="form-contrl" onkeypress="return isDecimalUpTo2(event,this);" AutoComplete="off"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>Dn2 Day:</td>
                                <td>
                                    <asp:TextBox ID="txtDn2Day" runat="server" CssClass="form-contrl" onkeypress="return isNumeric(event);" AutoComplete="off"></asp:TextBox>
                                </td>
                                <td>Dn2 %:</td>
                                <td>
                                    <asp:TextBox ID="txtDn2Percent" runat="server" CssClass="form-contrl" onkeypress="return isDecimalUpTo2(event,this);" AutoComplete="off"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>Dn3 Day:</td>
                                <td>
                                    <asp:TextBox ID="txtDn3Day" runat="server" CssClass="form-contrl" onkeypress="return isNumeric(event);" AutoComplete="off"></asp:TextBox>

                                </td>
                                <td>Dn3 %:</td>
                                <td>
                                    <asp:TextBox ID="txtDn3Percent" runat="server" CssClass="form-contrl" onkeypress="return isDecimalUpTo2(event,this);" AutoComplete="off"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>Dn4 Day:</td>
                                <td>
                                    <asp:TextBox ID="txtDn4Day" runat="server" CssClass="form-contrl" onkeypress="return isNumeric(event);" AutoComplete="off"></asp:TextBox>

                                </td>
                                <td>Dn4 %:</td>
                                <td>
                                    <asp:TextBox ID="txtDn4Percent" runat="server" CssClass="form-contrl" onkeypress="return isDecimalUpTo2(event,this);" AutoComplete="off"></asp:TextBox>
                                </td>
                            </tr>
                            <tr>
                                <td>Dn5 Day:</td>
                                <td>
                                    <asp:TextBox ID="txtDn5Day" runat="server" CssClass="form-contrl" onkeypress="return isNumeric(event);" AutoComplete="off"></asp:TextBox>

                                </td>
                                <td>Dn5 %:</td>
                                <td>
                                    <asp:TextBox ID="txtDn5Percent" runat="server" CssClass="form-contrl" onkeypress="return isDecimalUpTo2(event,this);" AutoComplete="off"></asp:TextBox>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <%-- <tr>
                        <td colspan="2" style="text-align: center;" class="custTheader">- Current Business Info -
                        </td>
                    </tr>
                    <tr>
                        <td>Companies Dealing with:<span id="Span19" class="mandatory">*</span></td>
                        <td>
                            <asp:TextBox ID="txtCompaniesDealing" runat="server" CssClass="form-contrl"></asp:TextBox>

                        </td>
                    </tr>
                    <tr>
                        <td>Approx. Turnover:<span id="Span20" class="mandatory">*</span></td>
                        <td>
                            <asp:TextBox ID="txtTurnover" runat="server" CssClass="form-contrl"></asp:TextBox>

                        </td>
                    </tr>
                    <tr>
                        <td>Network Size (No. of Retailers): <span id="Span21" class="mandatory">*</span></td>
                        <td>
                            <asp:TextBox ID="txtNetworkSize" runat="server" CssClass="form-contrl"></asp:TextBox>

                        </td>
                    </tr>
                    <tr>
                        <td>Districts Covered :<span id="Span22" class="mandatory">*</span></td>
                        <td>
                            <asp:TextBox ID="txtDistrictsCovered" runat="server" CssClass="form-contrl"></asp:TextBox>

                        </td>
                    </tr>
                    <tr>
                        <td>No. of Salesman working in market :<span id="Span23" class="mandatory">*</span></td>
                        <td>
                            <asp:TextBox ID="txtSalesmanCount" runat="server" CssClass="form-contrl"></asp:TextBox>

                        </td>
                    </tr>
                    <tr>
                        <td>Whether the Distributor has its own transport mechanism :<span id="Span24" class="mandatory">*</span></td>
                        <td>
                            <asp:DropDownList ID="ddlTransportMechanism" runat="server" CssClass="form-contrl dropDown select2">
                                <asp:ListItem Text="Yes" Value="Yes"></asp:ListItem>
                                <asp:ListItem Text="No" Value="No"></asp:ListItem>
                            </asp:DropDownList>

                        </td>
                    </tr>
                    <tr>
                        <td>Describe Distributor :<span id="Span25" class="mandatory">*</span></td>
                        <td>
                            <asp:TextBox ID="txtDistributorDesc" runat="server" CssClass="form-contrl" TextMode="MultiLine" Rows="3"></asp:TextBox>

                        </td>
                    </tr>--%>
                    <%-- <tr>
                    <td>Proposed TLV: <span id="Span26" class="mandatory">*</span></td>
                    <td>
                        <asp:DropDownList ID="ddlProposedTLV" runat="server" CssClass="form-contrl dropDown select2">
                            <asp:ListItem Text="Select" Value=""></asp:ListItem>
                        </asp:DropDownList>

                    </td>
                </tr>--%>
                    <tr>
                        <td colspan="2" style="text-align: center;" class="custTheader">- Document Details -
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 0px !important; border: 1px solid teal;">
                            <%--<div class="align-items-start justify-content-between">
                                <div>
                                    <div class="tabPrimaryHdr">Document Details</div>--%>
                            <asp:GridView ID="gvDocumentDetails" CssClass="newTable" runat="server" AutoGenerateColumns="False" BorderColor="#7F0037"
                                BorderStyle="Solid" BorderWidth="2px" Width="100%" EmptyDataText="No Dealer(s) Added."
                                Style="margin-right: 0px" ShowFooter="false">
                                <RowStyle CssClass="tlrowlight" />
                                <AlternatingRowStyle CssClass="tlrowdark" />
                                <PagerStyle HorizontalAlign="right" />
                                <HeaderStyle CssClass="tlheader_1" Font-Bold="True" Font-Size="9pt" ForeColor="#ffffff"
                                    Height="25px" HorizontalAlign="Center" />
                                <FooterStyle CssClass="footerTDStyle" />
                                <Columns>
                                    <asp:TemplateField HeaderText="Srl No.">
                                        <ItemTemplate>
                                            <asp:Label ID="lblSerial" runat="server"></asp:Label>

                                        </ItemTemplate>

                                        <HeaderStyle HorizontalAlign="Center" VerticalAlign="Middle" Width="10%" />
                                        <ItemStyle HorizontalAlign="Center" VerticalAlign="Middle" Width="10%" />
                                        <FooterStyle HorizontalAlign="Center" VerticalAlign="Middle" />
                                    </asp:TemplateField>
                                    <asp:TemplateField HeaderText="Document Type">
                                        <ItemTemplate>
                                            <asp:Label ID="lblDocType" runat="server" Text='<%# Bind("documentTypeName")%>'></asp:Label>
                                            <asp:HiddenField ID="hdnServerPath" runat="server" Value='<%# Eval("serverPath") %>' />
                                            <asp:HiddenField ID="hdnLatitude" runat="server" Value='<%# Eval("latitude") %>' />
                                            <asp:HiddenField ID="hdnLongitude" runat="server" Value='<%# Eval("longitude") %>' />
                                        </ItemTemplate>
                                        <FooterTemplate>
                                            <asp:DropDownList ID="ddlFtrDocType" runat="server" CssClass="form-contrl dropDown select2">
                                            </asp:DropDownList>
                                        </FooterTemplate>
                                        <HeaderStyle HorizontalAlign="Center" VerticalAlign="Middle" Width="30%" />
                                        <ItemStyle HorizontalAlign="Right" VerticalAlign="Middle" Width="30%" />
                                        <FooterStyle HorizontalAlign="Right" VerticalAlign="Middle" />
                                    </asp:TemplateField>

                                    <asp:TemplateField HeaderText="Document Name">
                                        <ItemTemplate>
                                            <asp:Label ID="lblDocumentName" runat="server" Text='<%# Bind("fileName")%>'></asp:Label>
                                        </ItemTemplate>
                                        <FooterTemplate>
                                            <asp:UpdatePanel ID="ftrUpdatePanel1" runat="server">
                                                <ContentTemplate>
                                                    <asp:FileUpload ID="FtrfileUpload" runat="server" CssClass="form-contrl" />
                                                </ContentTemplate>
                                                <Triggers>
                                                    <asp:PostBackTrigger ControlID="btnCmdUpload" />
                                                </Triggers>
                                            </asp:UpdatePanel>
                                        </FooterTemplate>
                                        <HeaderStyle HorizontalAlign="Center" VerticalAlign="Middle" Width="50%" />
                                        <ItemStyle HorizontalAlign="Right" VerticalAlign="Middle" Width="50%" />
                                        <FooterStyle HorizontalAlign="Right" VerticalAlign="Middle" />
                                    </asp:TemplateField>

                                    <asp:TemplateField HeaderText="Action">
                                        <ItemTemplate>
                                            <asp:UpdatePanel ID="ftrUpdatePanel2" runat="server">
                                                <ContentTemplate>
                                                    <asp:Button ID="btnCmdDownload" runat="server" Text="" title="Download" CssClass="btn_img_bg img_download"
                                                        CommandName="DownloadDoc" />
                                                    <asp:Button ID="btnCmdDelete" runat="server" Text="" title="Delete" CssClass="btn_img_bg img_delete"
                                                        CommandName="DeleteRecord" />
                                                </ContentTemplate>
                                                <Triggers>
                                                    <asp:PostBackTrigger ControlID="btnCmdDownload" />
                                                </Triggers>
                                            </asp:UpdatePanel>

                                        </ItemTemplate>
                                        <FooterTemplate>
                                            <asp:UpdatePanel ID="ftrUpdatePanel2" runat="server">
                                                <ContentTemplate>
                                                    <asp:Button ID="btnCmdUpload" runat="server" Text="" title="Upload" CssClass="btn_img_bg img_upload"
                                                        CommandName="Upload" />
                                                </ContentTemplate>
                                                <Triggers>
                                                    <asp:PostBackTrigger ControlID="btnCmdUpload" />
                                                </Triggers>
                                            </asp:UpdatePanel>
                                        </FooterTemplate>
                                        <HeaderStyle HorizontalAlign="Center" VerticalAlign="Middle" Width="10%" />
                                        <ItemStyle HorizontalAlign="Right" VerticalAlign="Middle" Width="10%" />
                                        <FooterStyle HorizontalAlign="Right" VerticalAlign="Middle" />
                                    </asp:TemplateField>
                                </Columns>
                            </asp:GridView>
                            <%--</div>
                            </div>--%>
                        </td>
                    </tr>




                    <tr>
                        <td colspan="2" style="text-align: center; width: 100%; padding-left: 10px;">
                            <asp:Button ID="btnSubmit" CssClass="but1 p-update-btn" runat="server" Text="Submit" Width="100px" Visible="false" />
                            <asp:Button ID="lnkbtnApprove" runat="server" CssClass="but1 approveBtnGrid" Text="Approve" Width="100px" ToolTip="Click to approve request" Visible="false"></asp:Button>
                            <asp:Button ID="lnkbtnReject" runat="server" CssClass="but1 rejctBtnGrid" Text="Reject" Width="100px" ToolTip="Click to reject request" Visible="false"></asp:Button>
                            <asp:Button ID="lnkbtnBacktoAdmin" runat="server" CssClass="but1 backtoAdminBtnGrid" Text="Back to Admin" Width="125px" ToolTip="Click to send back to Admin" Visible="false"></asp:Button>

                            <%--&nbsp;&nbsp;--%>
                            <asp:Button ID="BtnBack" CssClass="but1 whiteTextBtn backDarkBtn" runat="server" Text="Back" Width="100px" />
                            <asp:Button ID="btnDownloadAgreement" runat="server" CssClass="but1" Text="Download Agreement" ToolTip="Download signed agreement from eMsigner (workflow status must be Completed)." Visible="false" Width="150px" />
                            <div class="gridValidationMsg">
                                <asp:Label ID="lblValidationMessage" runat="server" ForeColor="Red" Text=""></asp:Label>
                            </div>
                        </td>
                    </tr>

                    <%-- <tr>
                        <td colspan="2" style="text-align: center; width: 100%; padding-left: 10px;">
                            <asp:LinkButton ID="lnkbtnApprove" runat="server" CssClass="but1" Text="Approve"  ToolTip="Click to approve request" Visible="false"></asp:LinkButton>
                            <asp:LinkButton ID="lnkbtnReject" runat="server" CssClass="but1" Text="Reject" ToolTip="Click to reject request" Visible="false"></asp:LinkButton>
                            <asp:LinkButton ID="lnkbtnBacktoAdmin" runat="server" CssClass="but1" Text="Back to Admin"  ToolTip="Click to send back to Admin" Visible="false"></asp:LinkButton>
                        </td>
                    </tr>--%>

                    <tr>
                        <td colspan="2" style="text-align: center;" class="custTheader">- Approval Log Details -
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 0px !important; border: 1px solid teal;">
                            <%--<div class="align-items-start justify-content-between">
                                <div>
                                    <div class="tabPrimaryHdr">Document Details</div>--%>
                            <asp:GridView ID="gvapproval" CssClass="newTable" runat="server" AutoGenerateColumns="False" BorderColor="#7F0037"
                                BorderStyle="Solid" BorderWidth="2px" Width="100%" EmptyDataText="No Record(s) Found."
                                Style="margin-right: 0px">
                                <RowStyle CssClass="tlrowlight" />
                                <AlternatingRowStyle CssClass="tlrowdark" />
                                <PagerStyle HorizontalAlign="right" />
                                <HeaderStyle CssClass="tlheader_1" Font-Bold="True" Font-Size="9pt" ForeColor="#ffffff"
                                    Height="25px" HorizontalAlign="Center" />
                                <Columns>
                                    <asp:TemplateField HeaderText="Action">
                                        <ItemTemplate>
                                            <asp:Label ID="lblaction" runat="server" Text='<%# Bind("action")%>'></asp:Label>

                                        </ItemTemplate>
                                        <HeaderStyle HorizontalAlign="Center" VerticalAlign="Middle" Width="20%" />
                                        <ItemStyle HorizontalAlign="Left" VerticalAlign="Middle" Width="20%" />
                                    </asp:TemplateField>

                                    <asp:TemplateField HeaderText="Action Taken">
                                        <ItemTemplate>
                                            <asp:Label ID="lblactiontaken" runat="server" Text='<%# Bind("action_taken")%>'></asp:Label>
                                        </ItemTemplate>
                                        <HeaderStyle HorizontalAlign="Center" VerticalAlign="Middle" Width="10%" />
                                        <ItemStyle HorizontalAlign="Center" VerticalAlign="Middle" Width="10%" />
                                    </asp:TemplateField>

                                    <asp:TemplateField HeaderText="Action Taken By">
                                        <ItemTemplate>
                                            <asp:Label ID="lblactiontaken" runat="server" Text='<%# Bind("action_taken_by")%>'></asp:Label>
                                        </ItemTemplate>

                                        <HeaderStyle HorizontalAlign="Center" VerticalAlign="Middle" Width="20%" />
                                        <ItemStyle HorizontalAlign="Left" VerticalAlign="Middle" Width="20%" />
                                    </asp:TemplateField>

                                    <asp:TemplateField HeaderText="Action Taken On">
                                        <ItemTemplate>
                                            <asp:Label ID="lblactiontakenon" runat="server" Text='<%# Bind("action_taken_on")%>'></asp:Label>
                                        </ItemTemplate>
                                        <HeaderStyle HorizontalAlign="Center" VerticalAlign="Middle" Width="20%" />
                                        <ItemStyle HorizontalAlign="Left" VerticalAlign="Middle" Width="20%" />
                                    </asp:TemplateField>

                                    <asp:TemplateField HeaderText="Remarks">
                                        <ItemTemplate>
                                            <asp:Label ID="lblremarks" runat="server" Text='<%# Bind("reason")%>'></asp:Label>
                                        </ItemTemplate>
                                        <HeaderStyle HorizontalAlign="Center" VerticalAlign="Middle" Width="30%" />
                                        <ItemStyle HorizontalAlign="Left" VerticalAlign="Middle" Width="30%" />
                                    </asp:TemplateField>
                                </Columns>
                            </asp:GridView>
                            <%--</div>
                            </div>--%>
                        </td>
                    </tr>
            </table>

        </ContentTemplate>
    </asp:UpdatePanel>

    <asp:UpdatePanel runat="server" ID="UpdatePanel4">
        <ContentTemplate>

            <asp:HiddenField ID="hdnTargetID" runat="server" />
            <ajaxToolkit:ModalPopupExtender ID="ModalPopupExtender1" runat="server" OkControlID="btnOk"
                PopupControlID="pnlMessageBox" TargetControlID="hdnTargetID" CancelControlID="btnOk"
                BackgroundCssClass="popupBackground">
            </ajaxToolkit:ModalPopupExtender>
            <asp:Panel ID="pnlMessageBox" runat="server" CssClass="popup p-main-modal" HorizontalAlign="Center">
                <div class="popupLabel">
                    <asp:Label ID="Label1" runat="server" ForeColor="White" Text="Message: Dealer Creation ADD/UPDATE"></asp:Label>
                </div>
                <div class="popup-message">
                    <asp:UpdatePanel runat="server">
                        <ContentTemplate>
                            <asp:Label ID="lblPopMessage" runat="server"></asp:Label>
                        </ContentTemplate>

                    </asp:UpdatePanel>

                </div>
                <div class="popup-actions">
                    <asp:Button ID="btnOk" CssClass="but1" runat="server" Text="Ok" OnClientClick="return RedirectToListScreen();" />
                </div>

            </asp:Panel>
        </ContentTemplate>
        <Triggers>
            <asp:AsyncPostBackTrigger ControlID="btnSubmit" />
        </Triggers>
    </asp:UpdatePanel>

        <asp:UpdatePanel runat="server" ID="UpdatePanel2">
    <ContentTemplate>

        <asp:HiddenField ID="hdnTargetID1" runat="server" />
        <ajaxToolkit:ModalPopupExtender ID="ModalPopupExtender3" runat="server" OkControlID="btnCancelModal"
            PopupControlID="Panel2" TargetControlID="hdnTargetID1" CancelControlID="btnCancelModal"
            BackgroundCssClass="popupBackground">
        </ajaxToolkit:ModalPopupExtender>
        <asp:Panel ID="Panel2" runat="server" CssClass="popup p-mdc-modal" Height="170px" HorizontalAlign="Center">
            <div class="popupLabel p-popup-label">
                <asp:Label ID="Label3" runat="server" ForeColor="White" Text="Message: Dealer Creation ADD/UPDATE"></asp:Label>
            </div>
            <div class="p-mdc-form-item" style="text-align: center; padding: 10px; min-height: 60px;">
                <asp:Label ID="Label4" runat="server" ForeColor="red" Text="Please Enter Remarks"></asp:Label>
                <asp:TextBox ID="txtRejectReason" runat="server" CssClass="form-contrl" TextMode="MultiLine" Rows="3"
                    MaxLength="500" placeholder="Enter Remarks..."></asp:TextBox>
            </div>
            <div class="p-modal-btn">
                <asp:Button ID="btnSubmitModal" CssClass="but1" runat="server" Text="Submit" OnClick="btnSubmitModal_Click" Width="100px" />
                <asp:Button ID="btnCancelModal" CssClass="but1" runat="server" Text="Cancel" OnClick="btnCancelModal_Click" Width="100px" />
            </div>
        </asp:Panel>
    </ContentTemplate>
    <Triggers>
        <asp:AsyncPostBackTrigger ControlID="lnkbtnReject" />
        <asp:AsyncPostBackTrigger ControlID="lnkbtnBacktoAdmin" />
    </Triggers>
</asp:UpdatePanel>

<%--    <asp:UpdatePanel runat="server" ID="UpdatePanel2">
        <ContentTemplate>

            <asp:HiddenField ID="hdnTargetID1" runat="server" />
            <ajaxToolkit:ModalPopupExtender ID="ModalPopupExtender3" runat="server" OkControlID="btnCancelModal"
                PopupControlID="Panel2" TargetControlID="hdnTargetID1" CancelControlID="btnCancelModal"
                BackgroundCssClass="popupBackground">
            </ajaxToolkit:ModalPopupExtender>
            <asp:Panel ID="Panel2" runat="server" CssClass="popup p-mdc-modal" HorizontalAlign="Center">
                <div class="popupLabel p-popup-label">
                    <asp:Label ID="Label3" runat="server" ForeColor="White" Text="Message: Dealer Creation ADD/UPDATE"></asp:Label>
                </div>
                <div class="p-mdc-form-item" style="text-align: center; padding: 10px; min-height: 60px;">
                    <asp:Label ID="Label4" runat="server" ForeColor="red" Text="Please Enter Reason"></asp:Label>
                    <asp:TextBox ID="txtRejectReason" runat="server" CssClass="form-contrl" TextMode="MultiLine" Rows="3"
                        MaxLength="500" placeholder="Enter rejection reason..."></asp:TextBox>
                </div>
                <div class="p-modal-btn">
                    <asp:Button ID="btnSubmitModal" CssClass="but1" runat="server" Text="Submit" OnClick="btnSubmitModal_Click" Width="100px" />
                    <asp:Button ID="btnCancelModal" CssClass="but1" runat="server" Text="Cancel" OnClick="btnCancelModal_Click" Width="100px" />
                </div>
            </asp:Panel>
        </ContentTemplate>
        <Triggers>
            <asp:AsyncPostBackTrigger ControlID="lnkbtnReject" />
            <asp:AsyncPostBackTrigger ControlID="lnkbtnBacktoAdmin" />
        </Triggers>
    </asp:UpdatePanel>--%>

    <%--<asp:UpdatePanel runat="server" ID="UpdatePanel3">
        <ContentTemplate>
            <asp:HiddenField ID="hdnTargetID1" runat="server" />

            <ajaxToolkit:ModalPopupExtender ID="ModalPopupExtender2" runat="server"
                OkControlID="btnSubmitModal"
                PopupControlID="pnlMessageBox"
                TargetControlID="hdnTargetID1"
                CancelControlID="btnCancelModal"
                BackgroundCssClass="popupBackground">
            </ajaxToolkit:ModalPopupExtender>

            <asp:Panel ID="Panel1" runat="server" CssClass="popup" Height="170px" HorizontalAlign="Center">
                <div class="popupLabel">
                    <asp:Label ID="Label2" runat="server" ForeColor="White" Text="Message: Dealer Creation ADD/UPDATE"></asp:Label>
                </div>
                <br />
                <div style="text-align: center; padding: 10px; height: 70px; overflow-y: auto;">
                    <asp:TextBox ID="txtRejectReason" runat="server" CssClass="form-contrl" TextMode="MultiLine" Rows="4"
                        MaxLength="500" placeholder="Enter rejection reason..."></asp:TextBox>
                </div>
                <br />
                <asp:Button ID="btnSubmitModal" CssClass="but1" runat="server" Text="Submit" OnClick="btnSubmitModal_Click" Width="100px" />
                <asp:Button ID="btnCancelModal" CssClass="but1" runat="server" Text="Cancel" OnClick="btnCancelModal_Click" Width="100px" />
            </asp:Panel>
        </ContentTemplate>
         <Triggers>
            <asp:AsyncPostBackTrigger ControlID="lnkbtnReject" />
            <asp:AsyncPostBackTrigger ControlID="lnkbtnBacktoAdmin" />
        </Triggers>
    </asp:UpdatePanel>--%>

    <br />
    <br />
    <br />
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="FooterContent" Runat="Server">
    <script src="includes/js/select2.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="Scripts/jquery.sumoselect.min.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            $('.dropDown').select2();
            $('.sumo').SumoSelect({ selectAll: true });
        });
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        prm.add_endRequest(function () {
            $('.dropDown').select2();
            $('.sumo').SumoSelect({ selectAll: true });
        });
    </script>
</asp:Content>

