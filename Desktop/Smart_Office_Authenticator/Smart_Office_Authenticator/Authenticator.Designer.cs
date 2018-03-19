namespace Smart_Office_Authenticator
{
    partial class Authenticator
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.portBox = new System.Windows.Forms.TextBox();
            this.DisconnectBttn = new System.Windows.Forms.Button();
            this.ConnectBttn = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.serial = new System.IO.Ports.SerialPort(this.components);
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.generatedCodeBox = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.receivedCodeBox = new System.Windows.Forms.TextBox();
            this.GenerateBttn = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.portBox);
            this.groupBox1.Controls.Add(this.DisconnectBttn);
            this.groupBox1.Controls.Add(this.ConnectBttn);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Location = new System.Drawing.Point(12, 12);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(179, 79);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Configure";
            // 
            // portBox
            // 
            this.portBox.Location = new System.Drawing.Point(38, 19);
            this.portBox.Name = "portBox";
            this.portBox.Size = new System.Drawing.Size(121, 20);
            this.portBox.TabIndex = 6;
            // 
            // DisconnectBttn
            // 
            this.DisconnectBttn.Location = new System.Drawing.Point(12, 48);
            this.DisconnectBttn.Name = "DisconnectBttn";
            this.DisconnectBttn.Size = new System.Drawing.Size(75, 23);
            this.DisconnectBttn.TabIndex = 7;
            this.DisconnectBttn.Text = "Disconnect";
            this.DisconnectBttn.UseVisualStyleBackColor = true;
            this.DisconnectBttn.Click += new System.EventHandler(this.DisconnectBttn_Click);
            // 
            // ConnectBttn
            // 
            this.ConnectBttn.Location = new System.Drawing.Point(93, 48);
            this.ConnectBttn.Name = "ConnectBttn";
            this.ConnectBttn.Size = new System.Drawing.Size(75, 23);
            this.ConnectBttn.TabIndex = 3;
            this.ConnectBttn.Text = "Connect";
            this.ConnectBttn.UseVisualStyleBackColor = true;
            this.ConnectBttn.Click += new System.EventHandler(this.ConnectBttn_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(6, 22);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(26, 13);
            this.label1.TabIndex = 2;
            this.label1.Text = "Port";
            // 
            // serial
            // 
            this.serial.DataReceived += new System.IO.Ports.SerialDataReceivedEventHandler(this.Serial_DataReceived);
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.generatedCodeBox);
            this.groupBox2.Controls.Add(this.label2);
            this.groupBox2.Controls.Add(this.receivedCodeBox);
            this.groupBox2.Controls.Add(this.GenerateBttn);
            this.groupBox2.Controls.Add(this.label3);
            this.groupBox2.Location = new System.Drawing.Point(12, 97);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(258, 111);
            this.groupBox2.TabIndex = 7;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Data Panel";
            // 
            // generatedCodeBox
            // 
            this.generatedCodeBox.Location = new System.Drawing.Point(93, 45);
            this.generatedCodeBox.Name = "generatedCodeBox";
            this.generatedCodeBox.Size = new System.Drawing.Size(159, 20);
            this.generatedCodeBox.TabIndex = 8;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(6, 48);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(85, 13);
            this.label2.TabIndex = 7;
            this.label2.Text = "Code Generated";
            // 
            // receivedCodeBox
            // 
            this.receivedCodeBox.Location = new System.Drawing.Point(93, 19);
            this.receivedCodeBox.Name = "receivedCodeBox";
            this.receivedCodeBox.Size = new System.Drawing.Size(159, 20);
            this.receivedCodeBox.TabIndex = 6;
            this.receivedCodeBox.TextChanged += new System.EventHandler(this.ReceivedCodeBox_TextChanged);
            // 
            // GenerateBttn
            // 
            this.GenerateBttn.Location = new System.Drawing.Point(12, 82);
            this.GenerateBttn.Name = "GenerateBttn";
            this.GenerateBttn.Size = new System.Drawing.Size(147, 23);
            this.GenerateBttn.TabIndex = 3;
            this.GenerateBttn.Text = "Generate access token";
            this.GenerateBttn.UseVisualStyleBackColor = true;
            this.GenerateBttn.Click += new System.EventHandler(this.GenerateBttn_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(6, 22);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(81, 13);
            this.label3.TabIndex = 2;
            this.label3.Text = "Code Received";
            // 
            // Authenticator
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(282, 221);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Name = "Authenticator";
            this.Text = "Smart Office - Authenticator";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Authenticator_FormClosing);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.TextBox portBox;
        private System.Windows.Forms.Button ConnectBttn;
        private System.Windows.Forms.Label label1;
        private System.IO.Ports.SerialPort serial;
        private System.Windows.Forms.Button DisconnectBttn;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.TextBox generatedCodeBox;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox receivedCodeBox;
        private System.Windows.Forms.Button GenerateBttn;
        private System.Windows.Forms.Label label3;
    }
}

