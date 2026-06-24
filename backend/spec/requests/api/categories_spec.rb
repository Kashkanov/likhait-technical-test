require 'rails_helper'

RSpec.describe "Api::Categories", type: :request do
  describe "GET /api/categories" do
    let!(:food) { Category.create!(name: "Food") }
    let!(:transport) { Category.create!(name: "Transport") }
    let!(:supplies) { Category.create!(name: "Supplies") }

    it "returns all categories" do
      get "/api/categories"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |c| c["name"] }).to include("Food", "Transport", "Supplies")
    end

    it "returns categories in alphabetical order" do
      get "/api/categories"

      json = JSON.parse(response.body)
      expect(json.map { |c| c["name"] }).to eq([ "Food", "Supplies", "Transport" ])
    end
  end
#   FEATURE-001 Test Cases for category creation
  describe "POST /api/categories" do
    context "with valid parameters" do
      let(:valid_params) do
        {
          category: {
            name: "Hobbies"
          }
        }
      end
      it "creates a new expense" do
       expect {
         post "/api/categories", params: valid_params, as: :json
       }.to change(Category, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["name"]).to eq("Hobbies")
     end
    end
    context "with existing category" do
      let!(:healthcare) { Category.create!(name: "Healthcare") }
      let(:existing_params) do
        {
          category: {
            name: "Healthcare"
          }
        }
      end
      it "returns an error" do
       expect {
         post "/api/categories", params: existing_params, as: :json
       }.to change(Category, :count).by(0)
          expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include("Name has already been taken")
     end
    end
  end
end
