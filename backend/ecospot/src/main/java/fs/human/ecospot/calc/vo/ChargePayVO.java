package fs.human.ecospot.calc.vo;

public class ChargePayVO {
    private int id;
    private String brand;
    private String type;
    private double memberPrice;
    private double nonmemberPrice;

    // Getter/Setter
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public double getMemberPrice() { return memberPrice; }
    public void setMemberPrice(double memberPrice) { this.memberPrice = memberPrice; }
    public double getNonmemberPrice() { return nonmemberPrice; }
    public void setNonmemberPrice(double nonmemberPrice) { this.nonmemberPrice = nonmemberPrice; }
}
